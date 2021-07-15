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
    let matchId = req.params.id;
    let update = req.body;

    //Mandar el id del partido.
    //Goles primer equipo (izquierda) = goalsOne
    //Goles segundo equipo (derecha) = goalsTwo

    Math.findById(matchId, (err, matchFind)=>{
        if(err){
            return res.status(500).send({message: "Error General"});
        }else if(teams){
            Match.findByIdAndUpdate(matchFind._id, update, {new: true}, (err, matchUpdate)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al actualizar pepe'});
                }else if(matchUpdate){
                    Team.findById(matchFind.teamOne, (err, teamOneFine)=>{
                        if(err){
                            return res.status(500).send({message: "Error General"});
                        }else if(teamOneFine){

                            let diferencia = Number.parseInt(update.goalsOne) - Number.parseInt(update.goalsTwo);

                            if(diferencia > 0){
                                //equipo uno gano
                                update.points = Number.parseInt(teamOneFine.points)+3;
                            }else if(diferencia < 0){
                                //equipo uno perdio
                            }else{
                                //equipo uno empato
                                update.points = Number.parseInt(teamOneFine.points)+1;
                            }

                            update.goalsF = Number.parseInt(teamOneFine.goalsF) + Number.parseInt(update.goalsOne);
                            update.goalsC =  Number.parseInt(teamOneFine.goalsC) +  Number.parseInt(update.goalsTwo);
                            update.goalsD =  Number.parseInt(teamOneFine.goalsD) +  Number.parseInt(update.goalsF) -  Number.parseInt(update.goalsC);

                            Team.findByIdAndUpdate(matchFind.teamOne, update, {new: true}, (err, teamOneUpdate)=>{
                                if(err){
                                    return res.status(500).send({message: "Error General"})
                                }else if(teamOneUpdate){

                                    update.goalsF = 0;
                                    update.goalsC = 0;
                                    update.goalsD = 0;

                                    Team.findById(matchFind.teamTwo, (err, teamTwoFind)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'});
                                        }else if(teamTwoFind){

                                                let diferencia = Number.parseInt(update.goalsTwo) - Number.parseInt(update.goalsOne);

                                                if(diferencia > 0){
                                                    //equipo dos gano
                                                    update.points = Number.parseInt(teamTwoFind.points)+3;
                                                }else if(diferencia < 0){
                                                    //equipo dos perdio
                                                }else{
                                                    //equipo dos empato
                                                    update.points = Number.parseInt(teamTwoFind.points)+1;
                                                }
                    
                                                update.goalsF = Number.parseInt(teamTwoFind.goalsF) + Number.parseInt(update.goalsTwo);
                                                update.goalsC =  Number.parseInt(teamTwoFind.goalsC) +  Number.parseInt(update.goalsOne);
                                                update.goalsD =  Number.parseInt(teamTwoFind.goalsD) +  Number.parseInt(update.goalsF) -  Number.parseInt(update.goalsC);

                                                Team.findByIdAndUpdate(matchFind.teamTwo, update, {new: true}, (err, teamTwoUpdate)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general'});
                                                    }else if(teamTwoUpdate){
                                                        return res.send({message: 'Datos almacenados'});
                                                    }else{
                                                        return res.status(402).send({message: 'No se encontro ningun registro'});
                                                    }
                                                });
                                        }else{
                                            return res.status(404).send({message:"No hay registros"});
                                        }
                                    });
                                }else{
                                    return res.status(404).send({message:"No hay registros"});
                                }
                            }); 
                        }else{
                            return res.status(404).send({message:"No hay registros"});
                        }
                    })
                }else{
                    return res.status(402).send({message: 'No se pudo actualizar'});
                }
            });
        }else{
            return res.status(404).send({message:"No hay registros"});
        }
    });
}

module.exports = {
    setTeam,
    updateTeam,
    removeTeam,
    getTeams,
    getData
}