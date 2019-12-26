/* jshint node: true */

var assert = require('chai').assert;
var request = require('supertest');

var erros = require('../index');


describe("error handling", function() {
  this._timeout = 9999;
  var app;

  beforeEach(function() {
    requireReset();

    app = require('./app');
    app.get("/", cb);
  });

  afterEach(function() {
    requireReset();
  });


  it('handles 404 when fouro4 middleware', function(done) {
    app
      .use(erros.fouro4())
      .use(erros.handler());

    request(app)
      .get("/not-found")
      .expect(404, 'Not Found')
      .end(done, done);
  });

  it('no fouro4 default to express route error', function(done) {
    app
      .use(erros.handler());

    request(app)
      .get("/not-found")
      .expect(404, 'Cannot GET /not-found\n')
      .end(done, done);
  });

  it("default status is 500", function(done) {
    app
      .get("/err", function(req, res, next) {
        next('Uh-oh!');
      })
      .use(erros.handler());

    request(app)
      .get("/err")
      .expect(500, 'Uh-oh!')
      .end(done, done);
  });

  it("handles Error", function(done) {
    app
      .get("/err", function(req, res, next) {
        next(new Error('Uh-oh!'));
      })
      .get("/oh-shit", function(req, res, next) {
        throw Error("Shit!");
      })
      .use(erros.handler());

    request(app)
      .get("/err")
      .expect(500, "Uh-oh!")
      .end(function(err, res) {
        if (err) return done(err);

        request(app)
          .get("/oh-shit")
          .expect(500, "Shit!")
          .end(done, done);
      });
  });

  it("overwrites default status", function(done) {
    app
      .get("/err", function(req, res, next) {
        next('Uh-oh!');
      })
      .use(erros.handler({default_status: 200}));

    request(app)
      .get("/err")
      .expect(200, "Uh-oh!")
      .end(done, done);
  });

  describe("templates and types", function() {
    it("4xx", function(done) {
      app
        .use(erros.fouro4())
        .use(erros.handler({views: __dirname+'/views', view_ext: 'jade'}));

      request(app)
        .get('/not-found')
        .accept('text/plain')
        .expect(404, "Not Found")
        .end(function(err) {
          if (err) return done(err);

          request(app)
            .get('/not-found')
            .accept("text/html")
            .expect(404, "<h1>Not Found</h1>")
            .end(function(err, res) {
              if (err) return done(err);

              request(app)
                .get("/not-found")
                .accept('application/json')
                .expect(404, {error: {status: 404, message: 'Not Found'}})
                .end(done, done);
            });
        });
    });

    it("5xx", function(done) {
      app
        .get("/err", function(req, res, next) {
          next('Uh-oh!');
        })
        .use(erros.handler({views: __dirname+'/views', view_ext: 'jade'}));

      request(app)
        .get('/err')
        .expect(500, "Uh-oh!")
        .end(function(err) {
          if (err) return done(err);

          request(app)
            .get('/err')
            .accept("text/html")
            .expect(500, "<h2>Uh-oh!</h2>")
            .end(function(err) {
              if (err) return done(err);

              request(app)
                .get("/err")
                .accept('application/json')
                .expect(500, {error: {status: 500, message: 'Uh-oh!'}})
                .end(done, done);
            });
        });
    });
  });
});


/*
 * deletes the requires form the require cache
 */

function requireReset() {
  delete require.cache[require.resolve('./app')];
  // delete require.cache[require.resolve('../index')];
}


/*
 * fake middleware
 */

function cb(req, res, next) {
  res.send("Hello World!");
}

