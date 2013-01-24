/*
 * controllers.js - All post controllers for creating matches and users.
 */

var db = require('../db.js');
var bcrypt = require('bcrypt');

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
  var username = req.param('username');
  var password = req.param('password');

  // Query MongoDB for single match
  db.User.findOne({ username: username }, function(err, user) {

      // Send message if not found
      if(!user) {
        res.send("Username and/or Password are incorrect");
      }
      else {

        // If user exists, lets check password
        var checkHash = bcrypt.compareSync(password, user.password);
      
        // If password is true, set session and redirect
        if (checkHash) {
          req.session.username = user.username;
          res.redirect('/');
        } 
        else {
        res.send("Username and /or Password are incorrect");
        }

      // Respond as json request
      res.json(json);
      }
  })
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

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  console.log(hash);

  //console.log(bcrypt.compareSync("blah", hash));

  var now = new Date();
  var user = new db.User({ username: username, email: email, password: hash, steamid: steamid });
  user.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    }
    else {
      req.session.username = user.username;
      res.send(true);
    }

  });
}
