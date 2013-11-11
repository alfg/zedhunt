/*
 * All API requests. Imported by app.js. Imports db.js for MongoDB connection
 * and models.
 */

var db = require('../db.js');
var moment = require('moment');

exports.groups = function(req, res){
  // Query all groups in MongoDB
  db.Match.find({}).sort('-date').execFind(function(err, groups) {
      // Set empty json object
      json = []

      // Iterate groups and construct json output
      groups.forEach(function (i) {
          json.push({
              id: i._id,
              //game: "/img/games/50x50/" + i.game + ".png",
              game: "/img/games/50x50/dayz.png",
              type: i.type,
              creator: i.creator,
              title: i.title,
              date: moment(i.date).fromNow(), //i.date.toJSON(),
              description: i.description,
              players: "1/3",
              details: {
                          requirements: {
                            karma: "10+",
                            rank: i.experience || null,
                            playstyle: i.playstyle || null
                          }
              }
          });
      });

      // Respond as json request
      res.json({groups: json});

  })
};

exports.group = function(req, res){
  var groupid = req.params.groupid;

  // Query group in MongoDB
  db.Match.findOne({ _id: groupid }, function(err, group) {

      // Send message if not found
      if(!group) {
        res.send(group + " not found.");
      }
      else {
        // Construct json object
        var json = { id: group._id,
                     game: "/img/games/50x50/" + group.game + ".png",
                     type: group.type,
                     creator: group.creator,
                     title: group.title,
                     date: moment(group.date).fromNow(), //i.date.toJSON(),
                     description: group.description,
                     players: "1/3",
                     details: {
                                requirements: {
                                  karma: group.karma || null,
                                  rank: group.experience || null,
                                  playstyle: group.playstyle || null
                                }
                     },
                     voip: {
                       type: "testtype",
                       address: "testaddress",
                       port: "testport",
                       password: "testpassword"
                     }
        };
      };

      // Respond as json request
      res.json({group: json});

  });
};

exports.profile = function(req, res){
  // Lowercase for querying
  var username = req.params.username.toLowerCase();

  // Query MongoDB for single match
  db.User.findOne({ username: username }, function(err, user) {
      // Send message if not found
      if(!user) {
        res.send(name + " not found.");
      }
      else {
      // Construct json object
      var json = { "name": user.username,
                   "avatar": "http://placehold.it/350/555555/aaaaaa&text=" + username,
                   "karma": user.karma,
                   "id": user.id,
                   "games": [],
                   "friends": [],
                   "trophies": []
                 };

      // Respond as json request
      res.json(json);
      }

  })
};

exports.stats = function(req, res){
  stats = { "usersonline": req.online.length}

  res.json(stats);
};

