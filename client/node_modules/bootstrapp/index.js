/* jshint node: true */

var express = require("express");
var erros = require("erros");
var _middleEarth = require("middle-earth");

/*
 * noop fn
 */

function noop() { /* */ }

/*
 * app & expose
 */

var app = module.exports = express();
app.set("port", (process.env.PORT || 1337));

app.middlewares([
  {name: "static",    fn: noop},
  {name: "error-404", cb: erros.fouro4()},
  {name: "error-end", cb: erros.handler({views: app.get("views")})}
]);

/*
 * setViews sets the views path and view engine
 *
 * @param {String} path
 * @param {String} engine
 * @api public
 */

app.setViews = function(path, engine) {
  this.set("views", path);
  this.set("view engine", engine);
};

/*
 * setStatic overwrites the static MiddleEarth stack with a proper path
 *
 * @param {String} path
 * @api public
 */

app.setStatic = function(path) {
  this
    .middlewares()
    .overwrite("static", {
      name: "static",
      cb: express.static(path)
    });
};

/*
 * setRoutes adds a route MiddleEarth stack before static
 *
 * @param {Function} draw
 * @api Private
 */

app.setRoutes = function(routes) {
  this
    .middlewares()
    .before("static", {
      name: "routes",
      fn: routes.bind(this, this)
    });
};

/*
 * listen overwrites the original express listen and allows applying MiddleEarth
 * stack middlewares before the app is spun up
 *
 * @param {Number} port
 * @param {Function} callback
 * @api Public
 */

app.listen = (function() {
  var self = this;
  var _listen = app.listen;
  return function(port, callback) {
    self
      .middlewares()
      .finish();

    return _listen.call(self, port, callback);
  };
}).call(app);

