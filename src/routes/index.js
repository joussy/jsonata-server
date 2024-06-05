var express = require('express');
var router = express.Router();
const jsonata = require('jsonata');

router.get('/', function(req, res, next) {
  var res = jsonata().evaluate(req, {});
  console.log(res);
  res.render('index', { title: 'Express' });
});

module.exports = router;