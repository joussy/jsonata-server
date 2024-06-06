var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');
const { stringify } = require('csv-stringify');
const { promisify } = require('util');

const stringifyAsync = promisify(stringify);

router.get('/', function (req, res, next) {
  // var res = jsonata().evaluate(req, {});
  console.log(res);
  res.render('index');
});


router.post('/jsonata', async (req, res, next) => {
  let jsonInput;

  // Parse JSON input
  try {
    jsonInput = JSON.parse(req.body.input);
  } catch (error) {
    return res.status(400).send({ error: `Input error: ${error.message}` });
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
        const csvOutput = await stringifyAsync(jsonResult, { header: true });
        return res.send(csvOutput);
      } catch (err) {
        return res.status(400).send({ error: `CSV output error: ${err.message}` });
      }
    }
    else
    {
      return res.send(jsonResult);
    }

  } catch (error) {
    return res.status(400).send({ error: `Template error: ${JSON.stringify(error, null, 2)}` });
  }
});

module.exports = router;