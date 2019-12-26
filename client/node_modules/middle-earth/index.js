/* jshint node: true */

var express = require('express');
var app = express.application;


/*
 * expose MiddleEarth
 */

module.exports = MiddleEarth;


/*
 * MiddleEarth
 *
 * @param {Application} app
 * @constructor
 */

function MiddleEarth(app) {
  this.app = app;
  this.middlewares = [];
  this.finished = false;
}


/*
 * load middlewares
 *
 * #load should ALWAYS be called first or using the short cut app.middlewares([..,..]),
 * it will overwrite any exisiting middlewares in queue
 *
 * @param {Array} mws
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.load = function(mws) {
  var self = this;

  self.middlewares = [];

  mws.forEach(function(o, i) {
    checkName.call(self, o.name);
    self.middlewares.push(o);
  });

  return self;
};


/*
 * `use` middlewares to the app
 */

MiddleEarth.prototype.finish = function() {
  var self = this;

  if (self.finished) {
    console.warn("MiddleEarth middlewares have already been applied");
  }

  self.middlewares.forEach(function(m, i) {
    if (m.hasOwnProperty('fn')) {
      m.fn();
    } else {
      var args = [m.cb];

      if (m.hasOwnProperty('path')) {
        args.splice(0, 0, m.path);
      }

      self.app.use.apply(self.app, args);
    }
  });

  self.middlewares = [];
  self.finished = true;
};


/*
 * applies the middlewares to the front of the list
 *
 * @param {Array} mws
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.prepend = function(mws) {
  checkNames.call(this, mws);

  this.middlewares = [].concat.apply(mws, this.middlewares);

  return this;
};


/*
 * applies the middlewares to the end of the list
 *
 * @param {Array} mws
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.append = function(mws) {
  checkNames.call(this, mws);

  this.middlewares = [].concat.apply(this.middlewares, mws);

  return this;
};


/*
 * overwrites an existing middleware
 *
 * @param {String} name
 * @param {Object} mw
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.overwrite = function(name, mw) {
  var index = indexOf.call(this, name);
  if (index === -1) {
    return this;
  }

  if ('function' === typeof mw) {
    if ('fn' in this.middlewares[index]) {
      this.middlewares[index].fn = mw;
    } else {
      this.middlewares[index].cb = mw;
    }
  } else  {
    this.middlewares.splice(index, 1, mw);
  }

  return this;
};


/*
 * inserts a middleware before another
 *
 * @param {String} name
 * @param {Object} mw
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.before = insert();


/*
 * insert a middleware after another
 *
 * @param {String} name
 * @param {Object} mw
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.after = insert(true);


/*
 * remove a middleware from queue
 *
 * @param {String} name
 * @return {MiddleEarth}
 */

MiddleEarth.prototype.remove = function(name) {
  var index = indexOf.call(this, name);

  if (index === -1) {
    return this;
  }

  this.middlewares.splice(index, 1);

  return this;
};


/*
 * insert method
 *
 * @param {Boolean} after
 * @return {Function}
 */

function insert(after) {
  return function(name, mw) {
    var index = indexOf.call(this, name);

    if (index < 0) {
      var msg = "Middleware named `"+name+"` could not be found";
      throw new Error(msg);
    }

    checkName.call(this, mw.name);

    if (true === after) {
      index = index+1;
    }

    this.middlewares.splice(index, 0, mw);

    return this;
  };
}


/*
 * locate middleware
 *
 * @param {String} name
 * @return {Number}
 */

function indexOf(name) {
  var middlewares = this.middlewares;
  var i = 0;
  var len = middlewares.length;

  for(; i<len; i++) {
    if (middlewares[i].name === name) {
      return i;
    }
  }

  return -1;
}


/*
 * throw error if middleware name exists
 *
 * @param {String} name
 */

function checkName(name) {
  if (indexOf.call(this, name) >= 0) {
    var msg = 'Middleware with name `'+name+'` already exists';
    throw new Error(msg);
  }
}


/*
 * check for names in array of incoming middlewares (used in prepend/append)
 *
 * @param {Array} mws
 */

function checkNames(mws) {
  var self = this;

  mws.forEach(function(o, i) {
    checkName.call(self, o.name);
  });
}


/*
 * add method to app
 *
 * @param {Array} mws
 * @return {MiddleEarth}
 */

app.middlewares = function(mws) {
  if (!(this.middleEarth instanceof MiddleEarth)) {
    this.middleEarth = new MiddleEarth(this);
  }

  if ('undefined' === typeof mws) {
    return this.middleEarth;
  }

  return this.middleEarth.load(mws);
};

