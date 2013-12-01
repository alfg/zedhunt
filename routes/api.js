/*
 * All API requests. Imported by app.js. Imports db.js for MongoDB connection
 * and models.
 */

var db = require('../db.js');
var moment = require('moment');

exports.groups = function(req, res){

  if (req.method === "POST") {
    // If POST, then build up the filters query
    var filters = buildFiltersQuery(req.body);
  }
  else
  {
    // Else just leave an empty list of an empty object
    var filters = [{}];
  }

  // Query all groups in MongoDB
  db.Match.find({$or : filters}).limit(50).sort('-date').exec(function(err, groups) {
      // Set empty json object
      var json = [];

      // Iterate groups and construct json output
      groups.forEach(function (i) {
          json.push({
              id: i._id,
              gameIcon: "/img/games/50x50/" + i.game + ".png",
              game: formatGame(i.game),
              type: i.type,
              creator: i.creator,
              title: i.title,
              date: moment(i.date_created).fromNow(), //i.date.toJSON(),
              description: i.description,
              players: i.size,
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
                     gameIcon: "/img/games/50x50/" + group.game + ".png",
                     game: formatGame(group.game),
                     type: group.type,
                     creator: group.creator,
                     title: group.title,
                     date: moment(group.date_created).fromNow(), //i.date.toJSON(),
                     description: group.description,
                     serverAddress: group.server_address,
                     players: group.size,
                     details: {
                                requirements: {
                                  karma: group.karma || null,
                                  rank: group.experience || null,
                                  playstyle: group.playstyle || null
                                }
                     },
                     voip: {
                       type: group.voip_type || null,
                       address: group.voip_address || null,
                       password: group.voip_password || null
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

/* Misc functions */

function formatGame(game) {
  var title;
  switch (game) {
    case "dayzmod":
      title = "DayZ Mod";
      break;
    default:
      title = "DayZ"
      break;
  }
  return title;
}

/* Takes req.body data and outputs a list of objects used for querying mongoose */
function buildFiltersQuery(postData) {
  var filters = [];

  var p = postData;
  for (var key in p) {
    if (p.hasOwnProperty(key)) {
      // Game Filters
      if (key === "gameAny" && p[key] === "true")
        filters.push({ game: "any" });
      if (key === "gameDayzMod" && p[key] === "true")
        filters.push({ game: "dayzmod" });
      if (key === "expAny" && p[key] === "true")
        filters.push({ experience: "any" });

      // Experience Filters
      if (key === "expNoob" && p[key] === "true")
        filters.push({ experience: "noob" });
      if (key === "expIntermediate" && p[key] === "true")
        filters.push({ experience: "intermediate" });
      if (key === "expExpert" && p[key] === "true")
        filters.push({ experience: "expert" });

      // Playstyle Filters
      if (key === "playAny" && p[key] === "true")
        filters.push({ playstyle: "any" });
      if (key === "playSurvivor" && p[key] === "true")
        filters.push({ playstyle: "survivor" });
      if (key === "playBandit" && p[key] === "true")
        filters.push({ playstyle: "bandit" });
    }
  }

  // If filters array is empty, then add an empty object literal
  if (!filters.length > 0)
    filters.push({});

  return filters;
}
