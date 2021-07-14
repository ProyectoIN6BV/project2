"use strict"

var express = require("express");
var LeagueController = require("../controllers/league.controller");
var mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.put("/:id/setLeague", mdAuth.ensureAuth, LeagueController.setLeague);
api.put("/:idU/updateLeague/:idL", mdAuth.ensureAuth, LeagueController.updateLeague);
api.put("/:idU/removeLeague/:idL", mdAuth.ensureAuth, LeagueController.removeLeague);
api.put("/updateLeagueAdmin/:idL",  [mdAuth.ensureAuth, mdAuth.ensureAdmin], LeagueController.updateLeagueAdmin);
api.put("/:idU/removeLeagueAdmin/:idL", [mdAuth.ensureAuth, mdAuth.ensureAdmin], LeagueController.removeLeagueAdmin);
api.get("/getLeaguesAdmin", [mdAuth.ensureAuth, mdAuth.ensureAdmin], LeagueController.getLeagueAdmin);
api.get("/getLeagues/:idU", mdAuth.ensureAuth, LeagueController.getLeague);
api.put("/:idU/setLeagueAdmin", [mdAuth.ensureAuth, mdAuth.ensureAdmin], LeagueController.setLeagueAdmin);
api.get("/getLeaguesAll/", [mdAuth.ensureAuth, mdAuth.ensureAdmin], LeagueController.getLeagueAll);

module.exports = api;