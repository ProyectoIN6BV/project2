"use strict"

var express = require("express");
var MatchController = require("../controllers/match.controller");
var mdAuth = require ("../middlewares/authenticated");
var api= express.Router();

api.put("/:id/:idO/:idT/saveMatch", mdAuth.ensureAuth, MatchController.saveMatch); //id: leagueId, idO: teamOne. idT: teamTwo
api.put("/matchUpdate/:id", mdAuth.ensureAuth, MatchController.matchUpdate);
api.get("/getMatch", mdAuth.ensureAuth, MatchController.getMatch);




module.exports = api;