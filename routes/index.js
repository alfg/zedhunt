
/*
 * GET home page.
 */

var db = require('../db.js')

exports.checkAuth = function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
  } else {
    next();
  }
}

exports.index = function(req, res){
  res.render('find', { title: 'Zedhunt Portal' });
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
