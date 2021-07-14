"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name:String,
    description:String,
    goalsF:Number,
    goalsC:Number,
    goalsD:Number,
    points:Number,
    gamesP:Number,
    image: String
})

module.exports = mongoose.model("team", teamSchema);