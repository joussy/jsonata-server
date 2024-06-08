var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');
const { stringify, parse } = require('csv/sync');

router.get('/', function (req, res, next) {
  // var res = jsonata().evaluate(req, {});
  console.log(res);
  res.render('index');
});


router.post('/jsonata', async (req, res, next) => {
  let jsonInput;

  if (req.body.csvInput) {
    // Parse CSV input
    try {
      jsonInput = parse(req.body.input, {
        columns: true,
        skip_empty_lines: true,
        delimiter: req.body.csvInputDelimiter
      });
    } catch (error) {
      return res.status(400).send({ error: `Input error: ${error.message}` });
    }
  }
  else {
    // Parse JSON input
    try {
      jsonInput = JSON.parse(req.body.input);
    } catch (error) {
      return res.status(400).send({ error: `Input error: ${error.message}` });
    }
  }

  // Check for empty JSON input
  if (!jsonInput) {
    return res.status(400).send({ error: "Empty JSON input" });
  }

  try {
    // Compile JSONata expression
    const compiledExpression = jsonata(req.body.expression);

    // Evaluate the expression
    const jsonResult = await compiledExpression.evaluate(jsonInput);

    if (req.body.csvOutput) {
      // Check if the result is an array
      if (!Array.isArray(jsonResult)) {
        return res.status(400).send({ error: "CSV output error: Result is not an array" });
      }

      // Convert result to CSV
      try {
        const csvOutput = stringify(jsonResult, { header: true, delimiter:  req.body.csvOutputDelimiter});
        return res.send(csvOutput);
      } catch (err) {
        return res.status(400).send({ error: `CSV output error: ${err.message}` });
      }
    }
    else {
      return res.send(JSON.stringify(jsonResult, null, 2));
    }

  } catch (error) {
    return res.status(400).send({ error: `Template error: ${JSON.stringify(error, null, 2)}` });
  }
});

module.exports = router;