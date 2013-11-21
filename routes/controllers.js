/*
 * controllers.js - All post controllers for creating matches and users.
 */

var util = require('util');
var db = require('../db.js');
var bcrypt = require('bcrypt');

exports.createGroup = function(req, res){
  var game = req.param('game');
  var size = req.param('size');
  var playstyle = req.param('playstyle');
  var title = req.param('title');
  var desc = req.param('desc');
  var serverAddress = req.param('serverAddress');
  var experience = req.param('experience');
  var voipType = req.param('voipType');
  var voipAddress = req.param('voipAddress');
  var voipPort = req.param('voipPort');
  var voipPassword = req.param('voipPassword');
  var groupPassword = req.param('groupPassword');
  var creator = req.param('creator');
  console.log(req.username);

  var now = new Date();
  var m = new db.Match({
    game: game,
    size: size,
    playstyle: playstyle,
    title: title,
    description: desc,
    server_address: serverAddress,
    voip_type: voipType,
    voip_address: voipAddress,
    voip_password: voipPassword,
    password: groupPassword,
    experience: experience,

    date_created: now,
    creator: creator
  });

  m.save(function(error, data) {
    if (error) {
        console.log(error);
        res.json(error);
    }
    else {
        res.send(data._id);
    }
  })
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
        console.log(checkHash);
      
        // If password is true, set session and redirect
        if (checkHash) {
          req.session.username = user.username;
          res.send(true);
        } 
        else {
        res.send("Username and /or Password are incorrect");
        }

      // Respond as json request
      res.send('what');
      }
  })
}

exports.logout = function(req, res){
  req.session = null;
  res.redirect('/login');
}

exports.register = function(req, res){
  // Validation
  req.checkBody('username', 'Username must contain at least 3 characters').len(3, 40);
  req.checkBody('password', 'Password must contain at least 6 characters').len(6, 40);

  var errors = req.validationErrors();
  if (errors) {
    res.json({"errors": errors}, 400)
  }
  else {
    // Check if username is taken
    db.User.findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        console.log(err.name);
        return;
      }
      // Send message if not found
      if(user) {
        console.log("user found");
        errors = [{ "msg" : "Username not available." }];
        res.json({ "errors": errors}, 400);
        return;
      }
      else {
        var username = req.param('username');
        var email = req.param('email');
        var password = req.body.password;
        var steamid = req.param('steamid');

        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            console.log(err);
          }
          bcrypt.hash(password, salt, function(err, hash) {
            var now = new Date();
            var user = new db.User({ username: username, email: email, password: hash, steamid: steamid });
            user.save(function(error, data) {
              if (error) {
                console.log(error);
                errors = [{ "msg" : "Unable to register." }];
                res.json({ "errors": errors }, 400);
              }
              else {
                req.session.username = user.username;
                res.send(true);
              }
            });
          });
        });

      }
    });

  }


}
