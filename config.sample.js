var config = {}

config.web = {};
config.redis = {};
config.mongodb = {};
config.firebase = {};

config.web.port = process.env.WEB_PORT || 3000;
config.web.sessionkey = 'super secret';
config.mongodb.host = 'mongodb://host/database';
config.redis.host = '127.0.0.1';
config.redis.port = 6379;
config.firebase.url = 'https://zombies.firebaseio.com';
config.firebase.token = 'secret token';

module.exports = config;