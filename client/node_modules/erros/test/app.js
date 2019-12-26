/* jshint node: true */

/*
 * this is so we can remove app from require cache and start with a clean app
 * on each test run.
 */


var express = require("express");
var bodyParser = require('body-parser');


/*
 * expose
 */

var app = module.exports = express();


/*
 * configure
 */

app.set('port', (process.env.PORT || 1337));
app.set('views', __dirname+'/../app/views');
app.set('view engine', 'jade');

app.use(bodyParser());

