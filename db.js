/* 
 * db.js - MongoDB connection and models
 */

// MongoDB import and connect
var mongoose = require('mongoose');
mongoose.connect('mongodb://ghxst.local/zedhunt');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    //connected
    console.log("connected to mongo");
});


/*
 * MongoDB Schema and Models */

var matchSchema = mongoose.Schema({
    type: { type: String, required: true },
    creator: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
    playstyle: { type: String, required: true },
    experience: { type: String, required: true }
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
