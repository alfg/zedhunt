/*
 * ZedHunt.com - A squad matchmaking platform for DayZ.
 * Powered by Express.js, MongoDB, and Knockout.js.
 *
 * Author: Alf
 *
 * Copyright (c) 2013 Alfred Gutierrez http://alfg.co
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://github.com/alfg/zedhunt
 */

// Module dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , api = require('./routes/api')
  , controllers = require('./routes/controllers')
  , usersOnline = require('./util/usersOnline')
  , http = require('http')
  , path = require('path')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  //app.use(express.session()); //cookie sessions for now
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

locals = function(req, res, next) {
  res.locals.session = req.session;
  console.log(req.session);
  next();
};

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', locals, routes.index);
app.get('/users', user.list);
app.get('/api/matches', api.matches);
app.get('/api/match/:matchid', api.match);
app.get('/api/profile/:username', api.profile);
app.get('/api/stats', usersOnline.trackUsers, usersOnline.usersOnline, api.stats);
app.post('/match/create', controllers.createMatch);
app.post('/login', controllers.login);
app.get('/logout', controllers.logout);
app.post('/register', controllers.register);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
