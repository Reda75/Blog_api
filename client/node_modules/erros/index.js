/* jshint node: true */

var path = require('path');
var statuscodes = require("http").STATUS_CODES;


/*
 * handler middlware
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports.handler = function(options) {
  return function(err, req, res, next) {
    if ('undefined' === typeof options) {
      options = {};
    }

    var viewpath = options.views || './';
    var viewext = options.view_ext || 'jade';

    var error = {
      status: options.default_status || 500,
      message: statuscodes[this.status]
    };

    if ('string' === typeof err) {
      error.message = err;
    }

    // handle Error and anything inherited, hopefully... eg.
    //
    //    function MyError(msg) {
    //      Error.captureStackTrace(this);
    //      this.message = msg;
    //      this.name = 'MyError';
    //    }
    //
    //    MyError.prototype = Object.create(Error.prototype);
    //
    if ('Error' === err.constructor.name) {
      error.message = err.message;

      if (err.status) {
        error.status = err.status;
      }
    }

    res.status(error.status); // set status

    var respondto = {
      text: function() {
        res.send(error.message);
      },
      html: function() {
        var template = 'client' === erroris.call(error) ? '4xx' : '5xx';
        var view = path.resolve(path.join(viewpath, template+'.'+viewext));
        res.render(view, {error: error});
      },
      json: function() {
        res.send({error: error});
      }
    };

    res.format(respondto);
  };
};


/*
 * 404 middleware
 *
 * Should be at the end of the middleware stack, but before the error handler
 * else express handles 404s by default
 *
 * @return {Function}
 * @api public
 */

exports.fouro4 = function() {
  return function(req, res, next) {
    var err = new Error();
    err.status = 404;
    err.message = statuscodes[err.status];
    next(err);
  };
};


/*
 * return the type of error based on status, Client (4xx) vs Server (5xx)
 *
 * @return {String}
 * @api private
 */

function erroris() {
  var self = this;
  var status = this.status;

  if ('undefined' === typeof status) {
    return 'server';
  }

  if (status >= 400 && status <= 499) {
    return 'client';
  } else {
    return 'server'; // everything else is assumed 5xx or should be
  }
}

