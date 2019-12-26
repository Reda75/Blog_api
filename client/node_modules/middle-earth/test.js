/* jshint node: true */

var assert = require('chai').assert;
var request = require('supertest');
var sinon = require('sinon');

var express = require('express');
var middlewares = require('.');

// var app = express();
var cb = function(req, res, next) {
  res.send({middlewares: res.locals.middlewares});
};


describe("middle-earth", function() {
  var app;

  beforeEach(function() {
    app = express();
  });

  afterEach(function() {
    app = null;
  });


  it("loads middlewares", function(done) {
    app
      .middlewares([
        {name: 'one', cb: mw('one')},
        {name: 'two', cb: mw('two')},
        {name: 'three', cb: mw('three')}
      ])
      .finish();

    app.get("/", cb);

    request(app)
      .get("/")
      .expect(200, {
        middlewares: ['one', 'two', 'three']
      })
      .end(done);
  });

  describe("load", function() {
    it("always over writes the existing middlewares in queue to be `use`", function(){
      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .append([
          {name: 'a', cb: mw('a')}
        ])
        .load([
          {name: 'two', cb: mw('one')}
        ]);

      assert.lengthOf(app.middlewares().middlewares, 1);
      assert.equal(app.middlewares().middlewares[0].name, 'two');
    });
  });

  it("prepends middlewares", function(done) {
    app
      .middlewares()
      .load([
        {name: 'one', cb: mw('one')},
        {name: 'two', cb: mw('two')}
      ])
      .prepend([
        {name: 'three', cb: mw('three')},
        {name: 'four', cb: mw('four')}
      ])
      .finish();

    app.get("/", cb);

    request(app)
      .get("/")
      .expect(200, {
        middlewares: ['three', 'four', 'one', 'two']
      })
      .end(done);
  });

  it("appends middlewares", function(done) {
    app
      .middlewares([
        {name: 'three', cb: mw('three')}
      ])
      .prepend([
        {name: 'two', cb: mw('two')}
      ]);

    app
      .middlewares()
      .append([
        {name: 'four', cb: mw('four')},
        {name: 'five', cb: mw('five')}
      ]);

    app.middlewares().finish();

    app.get("/", cb);

    request(app)
      .get("/")
      .expect(200, {
        middlewares: ['two', 'three', 'four', 'five']
      })
      .end(done);
  });

  it("inserts before/after another middleware", function(done) {
    app
      .middlewares([
        {name: 'three', cb: mw('three')},
        {name: 'four', cb: mw('four')}
      ])
      .append([
        {name: 'five', cb: mw('five')}
      ])
      .prepend([
        {name: 'one', cb: mw('one')},
        {name: 'two', cb: mw('two')}
      ]);

    app
      .middlewares()
      .before("two", {name: 'b', cb: mw('b')})
      .before("b", {name: 'a', cb: mw('a')})
      .after("three", {name: 'c', cb: mw('c')})
      .after("c", {name: 'd', cb: mw('d')});

    app.middlewares().finish();

    app.get("/", cb);

    request(app)
      .get("/")
      .expect(200, {
        middlewares: ['one', 'a', 'b', 'two', 'three', 'c', 'd', 'four', 'five']
      })
      .end(done);
  });

  it("supports removing a middleware from queue", function(done) {
    app
      .middlewares([
        {name: 'one', cb: mw('one')},
        {name: 'two', cb: mw('two')},
        {name: 'three', cb: mw('three')}
      ]);

    app.middlewares().remove('two');
    app.middlewares().finish();

    app.get("/", cb);

    request(app)
      .get("/")
      .expect(200, {
        middlewares: ['one', 'three']
      })
      .end(done);
  });

  describe('remove', function() {
    it("does nothing if the middleware doesn't exist", function(done) {
      app
        .middlewares([
          {name: 'one', cb: mw('one')},
          {name: 'two', cb: mw('two')},
          {name: 'three', cb: mw('three')}
        ])
        .remove('four')
        .finish();

      app.get('/', cb);

      request(app)
        .get("/")
        .expect(200, {
          middlewares: ['one', 'two', 'three']
        })
        .end(done);
    });
  });


  describe("before", function() {
    it("throws an error if the middleware is not found", function() {
      assert.throw(function() {
        app
          .middlewares([
            {name: 'one', cb: mw('one')}
          ])
          .before('two', {name: 'a', cb: mw('a')});
      }, "Middleware named `two` could not be found");
    });
  });

  describe("after", function() {
    it("throws an error if the middleware is not found", function() {
      assert.throw(function() {
        app
          .middlewares([
            {name: 'one', cb: mw('one')}
          ])
          .after('two', {name: 'a', cb: mw('a')});
      }, "Middleware named `two` could not be found");
    });
  });

  it("supports pathed middlewares", function(done) {
    var one = function(req, res, next) {
      res.send({one: true});
    };

    app
      .middlewares([
        {name: 'one', cb: one, path: "/one"}
      ])
      .finish();

    app.get("/", function(req, res, next) {
      res.send(401);
    });

    request(app)
      .get("/one")
      .expect(200, {
        one: true
      })
      .end(function() {
        request(app)
          .get("/")
          .expect(401)
          .end(done);
      });
  });

  it("throws when there is a name collision", function() {
    assert.throw(function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')},
          {name: 'one', cb: mw('two')}
        ]);
    }, "Middleware with name `one` already exists");

    assert.throw(function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .before('one', {name: 'one', cb: mw('two')});
    }, "Middleware with name `one` already exists");

    assert.throw(function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .after('one', {name: 'one', cb: mw('two')});
    }, "Middleware with name `one` already exists");

    assert.throw(function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .prepend([
          {name: 'one', cb: mw('two')}
        ]);
    }, "Middleware with name `one` already exists");

    assert.throw(function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .append([
          {name: 'one', cb: mw('two')}
        ]);
    }, "Middleware with name `one` already exists");
  });

  it("allows for forced overwrites of the middleware", function(done) {
    app
      .middlewares([
        {name: 'overwrite-me', cb: mw('one')},
        {name: 'no-touchy', cb: mw('three')}
      ])
      .overwrite('overwrite-me', {name: 'diff-name', cb: mw('two')});

    assert.lengthOf(app.middlewares().middlewares, 2);

    app.middlewares().finish();
    app.get('/', cb);

    request(app)
      .get('/')
      .expect(200, {
        middlewares: ['two', 'three']
      })
      .end(done, done);
  });

  describe('overwrite', function() {
    it('accepts just a middleware', function(done) {
      app
        .middlewares([
          {name: 'overwrite-me', cb: mw('one')}
        ])
        .overwrite('overwrite-me', mw('two'));

      assert.lengthOf(app.middlewares().middlewares, 1);

      app.middlewares().finish();
      app.get('/', cb);

      request(app)
        .get('/')
        .expect(200, {
          middlewares: ['two']
        })
        .end(done, done);
    });

    it('also resolves overwriting functions', function(done) {
      var route = express.Router();
      route.get("/posts", function(req, res, next) {
        res.send({middlewares: res.locals.middlewares});
      });

      var route2 = express.Router();
      route2.get("/comments", function(req, res, next) {
        res.send({comments: true});
      });

      app
        .middlewares([
          {name: 'one', cb: mw('one')},
          {name: 'two', cb: mw('two')}
        ])
        .after('one', {name: 'routes', fn: function() {
          app.use(route);
        }})
        .overwrite('routes', function() {
          app.use(route2);
        })
        .finish();

      app.get('/', cb);

      request(app)
        .get("/")
        .expect(200, {
          middlewares: ['one', 'two']
        })
        .end(function() {
          request(app)
            .get("/posts")
            .expect(404)
            .end(function() {
              request(app)
                .get("/comments")
                .expect(200, {
                  comments: true
                })
                .end(done, done);
            });
        });
    });
  });

  describe("finish", function() {
    it("clears out the middlewares queue", function() {
      app
        .middlewares([
          {name: 'one', cb: mw('one')},
        ])
        .append([
          {name: 'two', cb: mw('two')}
        ]);
      assert.lengthOf(app.middlewares().middlewares, 2);

      app.middlewares().finish();
      assert.lengthOf(app.middlewares().middlewares, 0);
    });

    it("warns when #finish is called more than once", function() {
      var msg = "MiddleEarth middlewares have already been applied";
      var c = sinon.mock(console);
      c.expects('warn').withArgs(msg).once();

      app
        .middlewares([
          {name: 'one', cb: mw('one')}
        ])
        .finish();

      app.middlewares().finish();

      c.verify();
      c.restore();
    });
  });

  describe("execution of functions", function() {
    it("invocates fn at the point in the middlware queue", function(done) {
      var route = express.Router();
      route.get("/posts", function(req, res, next) {
        res.send({middlewares: res.locals.middlewares});
      });

      app
        .middlewares([
          {name: 'one', cb: mw('one')},
          {name: 'two', cb: mw('two')}
        ])
        .after('one', {name: 'routes', fn: function() {
          app.use(route);
        }})
        .finish();

      app.get('/', cb);

      request(app)
        .get("/")
        .expect(200, {
          middlewares: ['one', 'two']
        })
        .end(function() {
          request(app)
            .get("/posts")
            .expect(200, {
              middlewares: ['one']
            })
            .end(done);
        });
    });
  });
});


/*
 * middleware
 *
 * @param {String} val
 * @return {Function}
 */

function mw(val) {
  return function(req, res, next) {
    if (!res.locals.middlewares) {
      res.locals.middlewares = [];
    }
    res.locals.middlewares.push(val);
    next();
  };
}

