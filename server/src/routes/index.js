var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');
const xmlJs = require('xml-js');
const { stringify, parse } = require('csv/sync');

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/api/jsonata', async (req, res, next) => {
  let jsonInput;
  if (req.body.inputFormat == 'csv') {
    // Parse CSV input
    try {
      jsonInput = parse(req.body.input, {
        columns: true,
        skip_empty_lines: true,
        delimiter: req.body.csvInputDelimiter
      });
    } catch (error) {
      return res.status(400).send({ error: `CSV Input error`, details: error.message });
    }
  }
  else if (req.body.inputFormat == 'json') {
    // Parse JSON input
    try {
      jsonInput = JSON.parse(req.body.input);
    } catch (error) {
      return res.status(400).send({ error: `JSON Input error`, details: error.message });
    }
  }
  else if (req.body.inputFormat == 'xml') {
    try {
      jsonInput = xmlJs.xml2js(req.body.input, {compact: true})
    } catch(error) {
      return res.status(400).send({ error: `XML Input error`, details: error.message });
    }
  }
  else {
    return res.status(400).send({ error: "Please specify input format" });
  }

  // Check for empty JSON input
  if (!jsonInput) {
    return res.status(400).send({ error: "JSON Input error", details: "Payload is empty" });
  }

    // Get Bindings
    let { expression, bindings, error } = getBindings(req.body.expression);

    if (error) {
      return res.status(400).send({ error: "JSONata Binding error", details: error });
    }

    let compiledExpression = null;

    try {
      if (!expression) expression = "$"
      // Compile JSONata expression
      compiledExpression = jsonata(expression);
    }
    catch (error) {
      return res.status(400).send({ error: "JSONata Expression error", details: error.message });
    }

    let jsonResult;
    // Evaluate the expression
    try {
      jsonResult = await compiledExpression.evaluate(jsonInput, bindings);
    }
    catch (error) {
      return res.status(400).send({ error: "JSONata Expression error", details: error });
    }

    if (req.body.outputFormat == 'csv') {
      // Check if the result is an array
      if (!Array.isArray(jsonResult)) {
        return res.status(400).send({ error: "CSV generation error", details: "The expression must return an array for CSV conversion" });
      }

      // Convert result to CSV
      try {
        const csvOutput = stringify(jsonResult, { header: true, delimiter: req.body.csvOutputDelimiter });
        return res.send(csvOutput);
      } catch (err) {
        return res.status(400).send({ error: "CSV generation error", details: err.message });
      }
    }
    else if (req.body.outputFormat == 'json') {
      try {
        const jsonOutputString = JSON.stringify(jsonResult, null, 2);
        return res.send(jsonOutputString);
      } catch (err) {
        return res.status(400).send({ error: "Output -> JSON error", details: err.message });
      }
    }
    else if (req.body.outputFormat == 'xml') {
      const xml = xmlJs.js2xml(jsonResult, {compact: true, spaces: 2});
      return res.send(xml);
    }
    else if (req.body.outputFormat == 'raw') {
      return res.send(jsonResult);
    }
    else {
      return res.status(400).send({ error: "Please specify output format" });
    }
});

function getBindings(expression) {
  const marker = "//BINDINGS";
  const parts = expression.split(marker);
  let expressionString = parts[0];
  let bindingString = parts[1]?.trim();
  let bindings;
  let errorStr;
  if (bindingString?.length > 2) {
    try { 
      bindings = new Function(`return (${bindingString})`)();
    }
    catch (error) {
      errorStr = error.message;
    }
  }
  return {
    expression: expressionString,
    bindings: bindings,
    error: errorStr
  };
}

module.exports = router;