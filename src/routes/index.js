var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');

router.get('/', function (req, res, next) {
  // var res = jsonata().evaluate(req, {});
  console.log(res);
  res.render('index');
});

router.post('/jsonata', function (req, res, next) {
  try {
    jsonInput = JSON.parse(req.body.input);
  }
  catch (error) {
    res.send(`Input error:\n${error.message}`);
    return;
  }
  if (!jsonInput) {
    res.send("");
    return;
  }
  try {
    const compiledExpression = jsonata(req.body.expression);
    compiledExpression.evaluate(jsonInput, {}, (error, success) => {
      if (error) {
        res.send(`evaluation error:\n${error}`);
      } else {
        res.send(success ?? "");
      }
    });
  }
  catch (error) {
    const errorText = JSON.stringify(error, null, 2);
    res.send(`Template error:\n${errorText}`);
  }
});

module.exports = router;