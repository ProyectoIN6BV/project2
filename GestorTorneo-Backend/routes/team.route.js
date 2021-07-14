"use strict"

var express = require("express");
var TeamController = require("../controllers/team.controller");
var mdAuth = require ("../middlewares/authenticated");
var api= express.Router();

api.put("/:idL/:idU/setTeam", mdAuth.ensureAuth, TeamController.setTeam);

api.put("/:idU/:idL/:idT/updateTeam", mdAuth.ensureAuth, TeamController.updateTeam);

api.put("/:idU/:idL/:idT/removeTeam", mdAuth.ensureAuth, TeamController.removeTeam);

api.get("/getTeams/:idU/:idL",mdAuth.ensureAuth, TeamController.getTeams);

module.exports = api;