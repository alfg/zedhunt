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
  , expressValidator = require('express-validator')
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
  app.set('view engine', 'html');
  app.set('layout', 'layout');
  app.engine('html', require('hogan-express'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(routes.checkAuth);
});

locals = function(req, res, next) {
  res.locals.session = req.session;
  console.log(req.session);
  next();
};

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', locals, routes.checkAuth, routes.index);
app.get('/find', locals, routes.checkAuth, routes.find);
app.get('/create', locals, routes.checkAuth, routes.create);
app.get('/group', locals, routes.checkAuth, routes.group);
app.get('/profile', locals, routes.checkAuth, routes.profile);

app.get('/users', user.list);
app.get('/api/groups', api.groups);
app.get('/api/group/:groupid', api.group);
app.get('/api/profile/:username', api.profile);
app.get('/api/stats', usersOnline.trackUsers, usersOnline.usersOnline, api.stats);
app.get('/register', routes.register);
app.get('/login', routes.login);
app.get('/logout', controllers.logout);

app.post('/login', controllers.login);
app.post('/group/create', controllers.createGroup);
app.post('/register', controllers.register);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
