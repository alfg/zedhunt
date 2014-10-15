
/*
 * GET home page.
 */

var config = require('../config');
var db = require('../db.js');
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(config.firebase.token);

exports.checkAuth = function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
  } else {
    next();
  }
}

exports.index = function(req, res){
  res.redirect('/find/');
};

exports.find = function(req, res){
  res.render('find', { title: 'Zedhunt Portal' });
};
exports.create = function(req, res){
  res.render('create', { title: 'Zedhunt Portal' });
};

exports.group = function(req, res){
  var token = tokenGenerator.createToken({uid: req.session.username, user: req.session.username})
  console.log(req.session.username);
  res.render('group', { title: 'Zedhunt Portal', token: token });
};

exports.profile = function(req, res){
  res.render('profile', { title: 'Zedhunt Portal' });
};

exports.login = function(req, res){
  console.log(req.session.username);
  if (req.session.username) {
    res.redirect('/');
  }
  res.render('auth/login', { title: 'Please Log In', layout: 'auth/auth_layout' });
};

exports.register = function(req, res){
  if (req.session.username) {
    res.redirect('/');
  }
  res.render('auth/register', { title: 'Please Register', layout: 'auth/auth_layout' });
};
