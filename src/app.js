var express = require('express');
var path = require('path');
var logger = require('morgan');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');

console.info("Starting JSONata Web Server ...")

var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '200mb'}));
app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/', indexRouter);    

module.exports = app;