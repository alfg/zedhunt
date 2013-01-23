/*
 * controllers.js - All post controllers for creating matches and users.
 */

var db = require('../db.js');

exports.createMatch = function(req, res){
  var platform = req.param('platform');
  var type = req.param('type');
  var game = req.param('game');
  var title = req.param('title');
  var desc = req.param('desc');
  var creator = req.param('creator');

  var now = new Date();
  var m = new db.Match({ platform: platform, game: game, type: type, creator: creator, title: title,
                        date: now, description: desc });
  m.save();

  res.send("Posted match");
};

exports.login = function(req, res){
  var username = req.param('email');
  console.log(username);
  req.session.username = username;
  res.redirect('/');
}

exports.logout = function(req, res){
  req.session = null;
  res.redirect('/');
}

exports.register = function(req, res){
  var username = req.param('username');
  var email = req.param('email');
  var password = req.param('password');
  var steamid = req.param('steamid');

  var now = new Date();
  var user = new db.User({ username: username, email: email, password: password, steamid: steamid });
  user.save();
  req.session.username = user.username;

  res.send('created user');
}
