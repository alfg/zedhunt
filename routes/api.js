/*
 * All API requests. Imported by app.js. Imports db.js for MongoDB connection
 * and models.
 */

var db = require('../db.js');
var io = require('socket.io');
var moment = require('moment');

exports.matches = function(req, res){
  // Query all matches in MongoDB
  db.Match.find({}).sort('-date').execFind(function(err, matches) {
      // Set empty json object
      json = []

      // Iterate matches and construct json output
      matches.forEach(function (i) {
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
                          requirements: { karma: "10+", rank: "Experienced", playstyle: i.playstyle },
                          members: ["Alf", "Superdude"]
              }
          });
      });

      // Respond as json request
      res.json({groups: json});

  })
};

exports.match = function(req, res){
  var matchid = req.params.matchid;

  // Query all matches in MongoDB
  db.Match.findOne({ _id: matchid }, function(err, match) {

      // Send message if not found
      if(!match) {
        res.send(match + " not found.");
      }
      else {
      // Construct json object
      var json = { id: match._id,
                   game: "/img/games/50x50/" + match.game + ".png",
                   type: match.type,
                   creator: match.creator,
                   title: match.title,
                   date: moment(match.date).fromNow(), //i.date.toJSON(),
                   description: match.description,
                   players: "1/3",
                   details: {
                              requirements: { karma: "10+", rank: "Experienced", playstyle: match.playstyle || '' },
                              members: ["Alf", "Superdude"]
                   }
      };
      };

      // Respond as json request
      res.json({match: json});

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

/*
exports.chat = function(req, res){
var chat = exports.sio
  .of('/chat')
  .on('connection', function (socket) {
    socket.emit('updatechat', 'SERVER', 'you have connnected to a room<br />')
});
res.json('success');
};
*/
