/* 
 * db.js - MongoDB connection and models
 */

// MongoDB import and connect
var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb.host);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    //connected
    console.log("connected to mongo");
});


/*
 * MongoDB Schema and Models */

var matchSchema = mongoose.Schema({
    date_created: { type: Date, required: true },
    creator: { type: String, required: true },
    game: { type: String, required: true },
    size: { type: Number, required: true },
    playstyle: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    experience: { type: String, required: true },
    server_address: { type: String },
    voip_type: { type: String, required: false },
    voip_address: { type: String, required: false },
    voip_password: { type: String, required: false },
    password: { type: String, required: false }
});
var Match = mongoose.model('Match', matchSchema)
module.exports.Match = Match;

var userSchema = mongoose.Schema({
    username: { type: String, trim: true, index: true, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, index: { unique: true, sparse: true }},
    karma: { type: Number, default: 0 },
    steamid: String,
    date: Date 
});
var User = mongoose.model('User', userSchema)
module.exports.User = User;

var userGamesSchema = mongoose.Schema({
    username: { type: String, trim: true, index: true, required: true },
    gameid: { type: Number, index: true, required: true },
    gametitle: { type: String, index: true, required: true }
});
var UserGames = mongoose.model('UserGames', userGamesSchema)
module.exports.UserGames = UserGames;
