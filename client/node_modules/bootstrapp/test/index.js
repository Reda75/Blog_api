/* jshint node: true */

var assert = require("chai").assert;
var request = require("supertest");
var app = require("..");

describe("bootstrap", function() {
  var server;

  before(function(done) {
    app.setViews(__dirname+"/views", "jade");
    app.setStatic(__dirname+"/public");
    app.setRoutes(function(app) {
      app.get("/route", function(req, res) {
        res.send({foo: "bar"});
      });

      app.get("/render", function(req, res, next) {
        res.render("render");
      });
    });

    server = app.listen(7331, done);
  });

  after(function(done) {
    server.close(done);
  });

  it("can route", function(done) {
    request("http://localhost:7331")
      .get("/route")
      .end(function(err, res) {
        assert.deepEqual(res.body, {foo: "bar"});
        done();
      });
  });

  it("can render", function(done) {
    request("http://localhost:7331")
      .get("/render")
      .end(function(err, res) {
        assert.equal(res.text, "Hello World!");
        done();
      });
  });

  it("services static", function(done) {
    request("http://localhost:7331")
      .get("/public.html")
      .end(function(err, res) {
        assert.equal(res.text, "Wat!\n");
        done();
      });
  });
});
