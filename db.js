/* 
 * db.js - MongoDB connection and models
 */

// MongoDB import and connect
var mongoose = require('mongoose');
mongoose.connect('mongodb://ghxst.local/matchmoblin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    //connected
    console.log("connected to mongo");
});


/*
 * MongoDB Schema and Models */

var matchSchema = mongoose.Schema({
    id: Number,
    platform: String,
    game: String,
    type: String,
    creator: String,
    title: String,
    date: Date,
    description: String
});
var Match = mongoose.model('Match', matchSchema)
module.exports.Match = Match;

var profileSchema = mongoose.Schema({
    name: String,
    karma: Number,
    id: Number,
});
var Profile = mongoose.model('Profile', profileSchema)
module.exports.Profile = Profile;

/* For test inputting data
var now = new Date();
var m = new Match({ id: 2, game: 'minecraft', type: 'LFM', creator: 'skydude', title: 'Anyone wanna play Minecraft?',
                    date: now, description: 'Hi, anyone wanna play minecraft for a few hours to build a fort.'});
m.save();
console.log(m.name)
*/
