"use stict"

var User = require("../models/user.model");
var League = require("../models/league.model");
var Team = require("../models/team.model");
const { param } = require("../routes/league.route");

function setTeam(req, res){
    var userId = req.params.idU;
    var leagueId = req.params.idL;
    var params = req.body;
    var team = new Team();

    if(userId != req.user.sub){
        return res.status(500).send({message : "No tienes permiso para realizar esta accion"})
    }else{
        League.findById(leagueId,(err, leagueTeam)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar la liga"})
            }else if(leagueTeam){
                Team.find(leagueTeam.teams.body, (err, teamFind)=>{
                    if(err){
                        return res.status(500).send({message:"Error al buscar la liga"})
                    }else if(teamFind){
                        Team.countDocuments({teams:teamFind._id},(err,count)=>{
                            if(err){
                                return res.status(500).send({message:"Error General", err})
                            }else if(count){
                                if(params.name && params.description){
                                    League.findById(leagueId, (err, leagueFind)=>{
                                        if(err){
                                            return res.status(500).send({message:"Error general en la busqueda"})
                                        }else if(leagueFind){
                                            if(count > 9){
                                                return res.status(500).send({message:"Ya supero el limite de equipos"})
                                            }else{
                                                team.name = params.name;
                                                team.description = params.description;
                                                team.goalsF = 0;
                                                team.goalsC = 0;
                                                team.goalD = 0;
                                                team.points = 0;
                                                team.gamesP = 0;
                            
                                            team.save((err, teamSaved)=>{
                                                if(err){
                                                   return res.status(500).send({message:"Error General al guardar usuario"}) 
                                                }else if(teamSaved){
                                                    League.findByIdAndUpdate(leagueId, {$push:{teams:teamSaved._id}},{new:true}, (err, pushLeague)=>{
                                                        if(err){
                                                                return res.status(500).send({message: 'Error general al setear el equipo'});
                                                            }else if(pushLeague){
                                                                return res.send({message: 'Equipo creado y agregado', pushLeague, count});
                                                            }else{
                                                                return res.status(404).send({message: 'No se seteo el equipo, pero sí se creó en la BD'});
                                                            }
                                                        
                                                    }).populate('teams')
                                                }else{
                                                    return res.status(500).send({message:"No se guardó el usuario"});
                                                }
                                            })
                                            }
                            
                                        }else{
                                            return res.status(403).send({message: "No se ha encontrado la liga para asignar al equipo"})
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Por favor ingresa los datos obligatorios'});
                                }
                            }else{
                                if(params.name && params.description){
                                    League.findById(leagueId, (err, leagueFind)=>{
                                        if(err){
                                            return res.status(500).send({message:"Error general en la busqueda"})
                                        }else if(leagueFind){
                                            team.name = params.name;
                                            team.description = params.description;
                                            team.goalsF = 0;
                                            team.goalsC = 0;
                                            team.goalD = 0;
                                            team.points = 0;
                                            team.gamesP = 0;
                            
                                            team.save((err, teamSaved)=>{
                                                if(err){
                                                   return res.status(500).send({message:"Error General al guardar usuario"}) 
                                                }else if(teamSaved){
                                                    League.findByIdAndUpdate(leagueId, {$push:{teams:teamSaved._id}},{new:true}, (err, pushLeague)=>{
                                                        if(err){
                                                                return res.status(500).send({message: 'Error general al setear el equipo'});
                                                            }else if(pushLeague){
                                                                return res.send({message: 'Equipo creado y agregado', pushLeague});
                                                            }else{
                                                                return res.status(404).send({message: 'No se seteo el equipo, pero sí se creó en la BD'});
                                                            }
                                                        
                                                    }).populate('teams')
                                                }else{
                                                    return res.status(500).send({message:"No se guardó el usuario"});
                                                }
                                            })
                            
                                        }else{
                                            return res.status(403).send({message: "No se ha encontrado la liga para asignar al equipo"})
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        return res.status(404).send({message: "No se encontro nada"})
                    }
                })
            }else{
                return res.status(404).send({message: "No se encontro la liga"})
            }
        })
    }
}
 
function updateTeam(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    let teamId = req.params.idT;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: "No tienes permiso para realizar esta acción"})
    }else{
        League.findOne({_id: leagueId, teams: teamId}, (err, TeamLeague)=>{
            if(err){
                return res.status(500).send({message:"Error General"});
            }else if(TeamLeague){
                Team.findByIdAndUpdate(teamId, update, {new:true},(err, updateTeam)=>{
                    if(err){
                        return res.status(500).send({message:"Error general al actualizar"})
                    }else if(updateTeam){
                        return res.send({message:"Equipo Actualizado",updateTeam })
                    }else{
                        return res.status(401).send({message:"No se pudo actualizar el contacto"})
                    }
                })
            }else{
                return res.status(404).send({message:"Equipo o Liga inexistente"})
            }
        })
    }
}

function removeTeam(req,res){
let userId = req.params.idU;
let leagueId = req.params.idL;
let teamId = req.params.idT;

if(userId != req.user.sub){ 
    return res.status(500).send({message: "No tienes permiso para realizar esta acción"})
    }else{
        League.findOneAndUpdate({_id: leagueId, teams: teamId},{$pull: {teams: teamId}}, {new:true}, (err, teamPull)=>{
            if(err){
                return res.status(500).send({message: "Error General"})
            }else if(teamPull){
                Team.findByIdAndRemove(teamId,(err, teamRemoved)=>{
                    if(err){
                        return res.status(500).send({message: "Error General al eliminar"})
                    }else if(teamRemoved){
                        return res.send({message:"Equipo Eliminado", teamPull})
                    }else{
                        return res.status(404).send({message: "Equipo no encontrado o ya fue eliminado"})
                    }
                })
            }else{
                return res.status(404).send({message: "No existe la liga que contienen el equipo"}) 
            }
        }).populate("teams")
    }
}

function getTeams(req,res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;

    if(userId != req.user.sub){
        return res.status(403).send({message: "No tienes permiso para realizar esta acción"})
    }else{
        League.find({}).populate("teams").exec((err, teams)=>{
            if(err){
                return res.status(500).send({message: "Error General"})
            }else if(teams){
                return res.send({message: "Equipos Encontrados", teams})
            }else{
                return res.status(404).send({message:"No hay registros"})
            }
        })
    }
}

function getData(req, res){
    
}

module.exports = {
    setTeam,
    updateTeam,
    removeTeam,
    getTeams
}