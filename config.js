var config = {}

config.web = {};
config.redis = {};
config.mongodb = {};
config.firebase = {};

config.web.port = process.env.WEB_PORT || 3000;
config.web.sessionkey = 'super secret';
config.mongodb.host = 'mongodb://ghxst.local/zedhunt';
config.redis.host = '127.0.0.1';
config.redis.port = 6379;

module.exports = config;