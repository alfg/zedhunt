
var redis = require('redis')
, r = redis.createClient();

console.log("Connected to Redis Server: " + r.host + ":" + r.port);

// Middlewares
exports.trackUsers = function(req, res, next){
  var ua = req.headers['user-agent'];
  r.zadd('online', Date.now(), ua, next);
};

exports.usersOnline = function(req, res, next){
  var min = 60 * 1000;
  var ago = Date.now() - min;
  r.zrevrangebyscore('online', '+inf', ago, function(err, users){
    if (err) return next(err);
    req.online = users;
    next();
  });
};

