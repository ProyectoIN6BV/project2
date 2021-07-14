"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var dayleagueSchema = Schema({
    number: String,
    date: String,
    win: String,
    lose: String
})

module.exports = mongoose.model("dayleague", dayleagueSchema);