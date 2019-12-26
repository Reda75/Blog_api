# Middle Earth

Middleware manager for [Express.js](https://github.com/visionmedia/express)

## Why...?

Core objective is to keep configurations for different enviroments/use cases in one spot vs. spreading them out based on where they need to be loaded.

## Install

    npm install middle-earth

## Usage

Examples below are basic. But should provide you with an idea of what you can do. 

---

    var express = require('express');
    var MiddleEarth = require('middle-earth');

    var app = express();


Appending and/or prepending.

    app
      .middlewares([
        {name: 'body-parser', cb: bodyParser()},
        {name: 'method-override', cb: methodOverride()}
      ]);

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app
        .middlewares()
        .prepend([
          {name: 'basicAuth', cb: express.basicAuth("user", "strong")}
        ])
        .append([
          {name: 'something-else', cb: somethingElse()},
          {name: 'and-another', cb: andAnother()}
        ]);
    }

    app.middlewares().finish();

Equivalent to:

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use(express.basicAuth("user", "strong"));
    }

    app.use(bodyParser());
    app.use(methodOverride());

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use(somethingElse());
      app.use(andAnother());
    }

---

You can also insert a middleware before or after another.

    app
      .middlewares([
        {name: 'body-parser', cb: bodyParser()},
        {name: 'method-override', cb: methodOverride()}
      ]);

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app
        .middlewares()
        .before('body-parser', {name: 'basicAuth', cb: express.basicAuth("user", "strong")});
        .after('body-parser', {name: 'other', cb: other()});
    }

    app.middlewares().finish();

Equivalent to:

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use(express.basicAuth("user", "strong"));
    }

    app.use(bodyParser());
    app.use(methodOverride());

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use(other());
    }


---

Pathed middlewares

    app
      .middlewares([
        {name: 'body-parser', cb: bodyParser()},
        {name: 'method-override', cb: methodOverride()},
        {name: 'static', cb: express.static(__dirname+'/../public')}
      ])

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app
        .middlewares()
        .prepend([
          {name: "basic-auth", cb: express.basicAuth("user", "strong"), path: "/admin"}
        ])
        .append([
          {name: 'other', cb: other()}
        ]);
    }

    app.middlewares().finish();

Equivalent to:

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use("/admin", express.basicAuth("user", "strong"));
    }

    app.use(bodyParser());
    app.use(methodOverride());
    app.use(express.static(__dirname+'/../public'));

    if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
      app.use(other());
    }


---

Execute a function at a specific point. Primary use would be to allow routes to be mapped at a particular spot.

    var route = express.Router();
    route.get("/posts", function(req, res, next) {
      res.send(200);
    });

    app
      .middlewares([
        {name: 'compress', cb: compress()},
        {name: 'logger', cb: Log.logger('dev')},
        {name: 'body-parser', cb: bodyParser()},
        {name: 'method-override', cb: methodOverride()},
        {name: 'cookie-parser', cb: cookieParser('secret')},
        {name: 'session', cb: session({secret: 'secret', key: 'sid', cookie: {secure: true}})},
        {name: 'csrf', cb: Csrf.csrf()},
        {name: 'csrf-local-token', cb: Csrf.localToken()},
        {name: 'static', cb: express.static(__dirname+'/../public')}
      ]);

    app
      .middlewares()
      .before('static', {name: 'routes', fn: function() {
        app.use(route);
      }});

    app.middlewares().finish();

Equivalent to:

    app.use(compress());
    app.use(Log.logger('dev'));
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(cookieParser('secret'));
    app.use(session({secret: 'secret', key: 'sid', cookie: {secure: true}}));
    app.use(Csrf.csrf());
    app.use(Csrf.localToken());
    app.use(route);
    app.use(express.static(__dirname+'/../public'));


---

Removing a middleware from the queue.

    app
      .middlewares([
        {name: 'body-parser', cb: bodyParser()},
        {name: 'method-override', cb: methodOverride()},
        {name: 'static', cb: express.static(__dirname+'/../public')},
        {name: 'logger', cb: logger()}
      ])

    if ('test' === process.env.NODE_ENV) {
      app
        .middlewares()
        .remove('logger');
    }

    app.middlewares().finish();


Equivalent to:

    app.use(bodyParser());
    app.use(methodOverride());
    app.use(express.static(__dirname+'/../public'));

    if ('test' != process.env.NODE_ENV) {
      app.use(logger());
    }

---

Ovewrite an existing middleware in the queue.

    app
      .middlewares([
        {name: 'overwrite-me', cb: fn1()},
        {name: 'no-touchy', cb: fn2()}
      ]);

    if ('test' === process.env.NODE_ENV) {
      app
        .middelwares()
        .overwrite('overwrite-me', {name: 'diff-name', cb: fn3()});
    }

    app.middelwares().finish();

Equivalent to:

    if ('test' === process.env.NODE_ENV) {
      app.use(fn3());
    } else {
      app.use(fn1());
    }

    app.use(fn2());


You may also just pass it a middlware/function. 

      app
        .middelwares()
        .overwrite('overwrite-me', function(req, res, next) {
          next();
        });

*Note, make sure you don't confuse your "middlewares" with the "function" executables you can add to the queue.*


## Important

This does not alter middlewares already applied (`use`'d) on the `app`. 

You can use it in conjuction with the normal `app.use()`, but middlewares will be applied when you call `#finish()` and the order will be set accordingly to that invocation point.


## Test

    npm test


## License

MIT
