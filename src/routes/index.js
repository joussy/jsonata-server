var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');
const { stringify, parse } = require('csv/sync');

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/jsonata', async (req, res, next) => {
  let jsonInput;
  // await new Promise(resolve => setTimeout(resolve, 5000));

  if (req.body.csvInput) {
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
  else {
    // Parse JSON input
    try {
      jsonInput = JSON.parse(req.body.input);
    } catch (error) {
      return res.status(400).send({ error: `JSON Input error`, details: error.message });
    }
  }

  // Check for empty JSON input
  if (!jsonInput) {
    return res.status(400).send({ error: "JSON Input error", details: "Payload is empty" });
  }

  try {
    // Get Bindings
    const { expression, bindings, error} = getBindings(req.body.expression);

    if (error) {
      return res.status(400).send({ error: "JSONata Binding error", details: error });
    }
    // Compile JSONata expression
    const compiledExpression = jsonata(expression);

    // Evaluate the expression
    const jsonResult = await compiledExpression.evaluate(jsonInput, bindings);

    if (req.body.csvOutput) {
      // Check if the result is an array
      if (!Array.isArray(jsonResult)) {
        return res.status(400).send({ error: "CSV output error: Result is not an array" });
      }

      // Convert result to CSV
      try {
        const csvOutput = stringify(jsonResult, { header: true, delimiter: req.body.csvOutputDelimiter });
        return res.send(csvOutput);
      } catch (err) {
        return res.status(400).send({ error: `CSV output error: ${err.message}` });
      }
    }
    else {
      return res.send(JSON.stringify(jsonResult, null, 2));
    }

  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: "Template error", details: error });
  }
});

function getBindings(expression) {
  const marker = "//BINDINGS";
  const parts = expression.split(marker);
  let expressionString = parts[0]?.trim();
  let bindingString = parts[1]?.trim();
  let bindings;
  let error;
  if (bindingString?.length > 2) {
    try {
      bindings = new Function(`return (${bindingString})`)();
    }
    catch (error) {
      error = error.message;
    }
  }
  return {
    expression: expressionString,
    bindings: bindings,
    error
  };
}

module.exports = router;