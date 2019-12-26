# Erros.js

Simple Express error handler

# Installation

    npm install erros

# Usage

    var app = require('express')();
    var erros = require('erros');

    // configure your app...

    app.use(erros.handler()); // should be last in the middleware stack

Responds to content types:

* `text/html`
* `text/plain`
* `application/json`

---

Define your own view folder and view engine extension.

    app.use(erros.handle({views: __dirname+'/views', view_ext: 'jade'}));

* `views` your views directory, default `./`
* `view_ext` view engine extension, default `jade`

`Accept: text/html` will always attempt to respond with `res.render`.

Your error pages should be named `5xx`.your-extension and `4xx`.your-extension for Server and Client errors respectively.

---

Change the default Status code.

    app.use(erros.handle({default_status: 200}));

Status code will be 200, unless your error has a `status` property defining another code. Eg. use of custom Error

    function MyError(msg, status) {
      Error.captureStackTrace(this);
      this.message = msg;
      this.name = 'MyError';
      this.status = status;
    }

    MyError.prototype = Object.create(Error.prototype);


# License

MIT

