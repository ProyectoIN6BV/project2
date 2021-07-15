'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    teamOne: [{type: Schema.ObjectId, ref: 'team'}],
    teamTwo: [{type: Schema.ObjectId, ref: 'team'}],
    goalsOne: Number,
    goalsTwo:Number,
    date: Date,
    leagues: [{type: Schema.ObjectId, ref: 'league'}]
})

module.exports = mongoose.model('match', matchSchema);