"use strict"

var Match = require("../models/match.model");
var League = require("../models/league.model");
var Team = require("../models/team.model");

function saveMatch(req, res){
    var leagueId = req.params.id;
    var teamOneId = req.params.idO;
    var teamTwoId = req.params.idT;
    var params = req.body;
    var match = new Match();
    console.log(req.body)
    //mandar solo la fecha por params
    Team.findById(teamOneId, (err, teamOFind)=>{
        if(err){
            console.log(err)
            return res.status(500).send({message: "Error al buscar equipo"});
        }else if(teamOFind){
            Team.findById(teamTwoId, (err, teamTFind)=>{
                if(err){
                    console.log(err)
                    return res.status(500).send({message: "Error al buscar equipo"});
                }else if(teamTFind){

                    Match.find({teamOne: teamOneId, teamTwo: teamTwoId, date: params.date}, (err, matchFind)=>{
                        if(err){
                            console.log(err)
                            return res.status(500).send({message: "Error al buscar partido"});
                        }else if(matchFind){
                            match.teamOne = teamOneId;
                            match.teamTwo = teamTwoId;
                            match.date = params.date;
                            match.leagues = leagueId;
                            match.goalsOne = 0;
                            match.goalsTwo = 0;
                            match.save((err, matchSaved)=>{
                                if(err){
                                    console.log(err)
                                    return res.status(500).send({message: "Error en el servidor"});
                                }else if(matchSaved){
                                    return res.send({message: 'Partido generado con exito', matchSaved});
                                }else{
                                    return res.status(402).send({message: "No se pudo crear el partido"});
                                }
                            })          
                        }else{

                            match.teamOne = teamOneId;
                            match.teamTwo = teamTwoId;
                            match.date = params.date;
                            match.leagues = leagueId;
                            match.goalsOne = params.goalsOne;
                            match.goalsTwo = params.goalsTwo;
                            match.save((err, matchSaved)=>{
                                if(err){
                                    console.log(err)
                                    return res.status(500).send({message: "Error en el servidor"});
                                }else if(matchSaved){
                                    return res.send({message: 'Partido generado con exito', matchSaved});
                                }else{
                                    return res.status(402).send({message: "No se pudo crear el partido"});
                                }
                            })                                  
                        }
                    });
                }else{
                    return res.status(402).send({message: "No se encontraron registros"});
                }
            });
        }else{
            return res.status(402).send({message: "No se encontraron registros"});
        }
    });
    
}

function matchUpdate(req, res){
    let matchId = req.params.id;
    let update = req.body;

    if(update.date){
        Match.findById(matchId, (err, matchFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar partido"});
            }else if(matchFind){
                Match.findByIdAndUpdate(matchId, update, {new:true},(err, updateMatch)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar partido"});
                    }else if(updateMatch){
                        return res.send({message: "Partido actualizado", updateMatch});
                    }else{
                        return res.status(402).send({message: "No se encontraron registros"});
                    }
                });
            }else{
                return res.status(402).send({message: "No se encontraron registros"});
            }
        })
    }else{
        return res.status(402).send({message: "Por favor envia los datos minimos para realizar la operacion1"})
    }
    
}

function getMatch(req, res){
    var id = req.params.id;
    Match.find({leagues: id}, (err, match)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener partidos"});
        }else if(match){
            return res.send({message:"partidos encontrados", match});
        }else{
            return res.status(402).send({message: "No se encontraron registros"});
        }
    }).sort({date: -1}).populate("teamOne").populate("teamTwo");

}

module.exports = {
    saveMatch,
    matchUpdate,
    getMatch
}