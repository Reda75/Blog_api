# bootstr*app*

[![Build Status](https://travis-ci.org/nowk/bootstrapp.js.svg?branch=master)](https://travis-ci.org/nowk/bootstrapp.js)
[![Code Climate](https://codeclimate.com/github/nowk/bootstrapp.js.png)](https://codeclimate.com/github/nowk/bootstrapp.js)
[![David DM](https://david-dm.org/nowk/bootstrapp.js.png)](https://david-dm.org/nowk/bootstrapp.js)

Express basic boilerplate. *With an extra **p***

## Install

    npm install bootstrapp --save

## Usage

    var app = require("bootstrapp");
    app.listen(1337, function() {
      console.log("listening...");
    });

---

Set static

    app.setStatic(__dirname+"/public");

Set views + engine

    app.setViews(__dirname+"/views", "jade");

Define routes

    app.setRoutes(function(app) {
      app.get("/", function(req, res) {
        res.send(200);
      });
    });

---

Powered by [MiddleEarth](https://github.com/nowk/middle-earth.js) which allows you to pop in more middlewares into the stack.

Ex: body-parser

    app.middlewares().before("routes", {
      name: 'body-parser',
      cb: bodyParser()
    });

Current middleware stack:

    // static, this is a noop, services as a starting point to add other middlewares
    {name: "static",    fn: noop}

<!-- -->

    // erros to handle basic error handling
    {name: "error-404", cb: erros.fouro4()}
    {name: "error-end", cb: erros.handler({views: app.get("views")})}

### License

MIT
