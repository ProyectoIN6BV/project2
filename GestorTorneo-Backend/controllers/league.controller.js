"use strict"

var User = require("../models/user.model");
var League = require("../models/league.model");

function setLeague (req,res){
    var userId = req.params.id;
    var params = req.body;
    var league = new League();

    if(userId != req.user.sub){
        return res.status(500).send({message: "No tiene"})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: "Error General en la busqueda"})
            }else if(userFind){
                league.name = params.name;
                league.description = params.description;
                
                league.save((err, leagueSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error General al guardar"})
                    }else if(leagueSaved){
                        User.findByIdAndUpdate(userId, {$push:{leagues: leagueSaved._id}}, {new:true}, (err, pushLeague)=>{
                            if(err){
                                return res.status(500).send({message: "Error General al agregar la liga"})
                            }else if(pushLeague){
                                return res.send({message: "Liga creado y agregado", pushLeague});
                            }else{
                                return res.status(404).send({message: "No se seteo la liga, pero si se creo en la BD"})
                            }
                        }).populate("leagues")
                    }else{
                        return res.status(404).send({message: "No se pudo Guardar la Liga"})
                    }
                })
            }else{
                return res.status(404).send({message: "Usuario no existente para crear la liga"})
            }
        })
    }

}

function updateLeague(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: "No tienes permiso para realizaar esta acción"})
    }else{
        if(update.name){
            User.findOne({_id: userId, leagues: leagueId}, (err, updateLeague)=>{
                if(err){
                    return res.status(500).send({message: "Error General"})
                }else if(updateLeague){
                    League.findByIdAndUpdate(leagueId, update, {new: true},(err, updateLeague)=>{
                        if(err){
                            return res.status(500).send({message: "Error General al Actualizar"})
                        }else if(updateLeague){
                            return res.send({message: "League Actualizado", updateLeague});
                        }else{
                            return res.status(401).send({message: "No se pudo Actualizar el Contacto"})
                        }
                    })
                }else{
                    return res.status(404).send({message: "Usuario o Liga inexistente"})
                }
            })
        }else{
            return res.status(404).send({message: "Por Favor ingresa los datos mímimos"});
        }
    }
}

function removeLeague(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'})
    }else{
        User.findOneAndUpdate({_id: userId, leagues: leagueId},
            {$pull: {leagues: leagueId}}, {new:true}, (err, leaguePull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(leaguePull){
                    League.findByIdAndRemove(leagueId, (err, leagueRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar la liga', err})
                        }else if(leagueRemoved){
                            return res.send({message: 'League eliminado permanentemente', leaguePull});
                        }else{
                            return res.status(404).send({message: 'Registro no encontrado o la liga se ha eliminado con anterioridad'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe el usuario que contiene la liga para eliminar'})
                }
            }).populate('leagues')
    }
}

function updateLeagueAdmin(req, res){
    let leagueId = req.params.idL;
    let update = req.body;

    if(update.name){
        League.findByIdAndUpdate(leagueId, update, {new: true},(err, updateLeague)=>{
            if(err){
                return res.status(500).send({message: "Error General al Actualizar"})
            }else if(updateLeague){
                return res.send({message: "League Actualizado", updateLeague});
            }else{
                return res.status(401).send({message: "No se pudo Actualizar el Contacto"})
            }
        })
    }else{
        return res.status(404).send({message: "Por Favor ingresa los datos mímimos"});
    }
}

function removeLeagueAdmin(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    
  
    User.findOneAndUpdate({_id: userId, leagues: leagueId},
        {$pull: {leagues: leagueId}}, {new:true}, (err, leaguePull)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(leaguePull){
                League.findByIdAndRemove(leagueId, (err, leagueRemoved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al eliminar la liga', err})
                    }else if(leagueRemoved){
                        return res.send({message: 'League eliminado permanentemente', leaguePull});
                    }else{
                        return res.status(404).send({message: 'Registro no encontrado o la liga se ha eliminado con anterioridad'})
                    }
                })
            }else{
                return res.status(404).send({message: 'No existe el usuario que contiene la liga para eliminar'})
            }
        }).populate('leagues')
}

function getLeagueAdmin(req,res){
    
    League.find({}, (err, leagueFind)=>{
        if(err){
            res.status(500).send({message: "Error al buscar las empresas"})
        }else if(leagueFind){
            res.send({message: "Ligas encontradas: ", leagueFind})
        }else{
            return res.status(403).send({message:"Nos se encontraron registros"})
        }
    })
    
    
}

function getLeague(req,res){
    let userId = req.params.idU;

    if(userId != req.user.sub){
        return res.status(404).send({message:"No tiener permisos para realizar esta accion"});
    }else{
        User.findById(userId,(err, userFind)=>{
            if(err){
                return res.status(500).send({message:"Error general en el servidor"})
            }else if(userFind){
                League.find(userFind.leagues.body, (err, leagueFind)=>{
                    if(err){
                        res.status(500).send({message: "Error al buscar las empresas"})
                    }else if(leagueFind){
                        res.send({message: "Ligas encontradas: ", leagueFind})
                    }else{
                        return res.status(403).send({message:"Nos se encontraron registros"})
                    }
                })
            }else{
                return res.status(418).send({menssage: "No hay registros"});
            }
        })
    }
}

function getLeagueAll(req, res){

    User.find({}).populate("leagues").exec((err, users)=>{
        if(err){
            return res.status(500).send({message: "Error general", err})
        }else if(users){
            return res.send({message: "Usuarios encontrados", users})
        }else{
            return res.status(404).send({message: "No hay registros"})
        }
    })
     
}

function setLeagueAdmin (req,res){
    var userId = req.params.idU;
    var params = req.body;
    var league = new League();

    User.findById(userId, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: "Error General en la busqueda"})
        }else if(userFind){
            league.name = params.name;
            league.count = params.count;
            
            league.save((err, leagueSaved)=>{
                if(err){
                    return res.status(500).send({message: "Error General al guardar"})
                }else if(leagueSaved){
                    User.findByIdAndUpdate(userId, {$push:{leagues: leagueSaved._id}}, {new:true}, (err, pushLeague)=>{
                        if(err){
                            return res.status(500).send({message: "Error General al agregar la liga"})
                        }else if(pushLeague){
                            return res.send({message: "Liga creado y agregado", pushLeague});
                        }else{
                            return res.status(404).send({message: "No se seteo la liga, pero si se creo en la BD"})
                        }
                    }).populate("leagues")
                }else{
                    return res.status(404).send({message: "No se pudo Guardar la Liga"})
                }
            })
        }else{
            return res.status(404).send({message: "Usuario no existente para crear la liga"})
        }
    })
}

module.exports = {
    setLeague,
    updateLeague,
    removeLeague,
    updateLeagueAdmin,
    removeLeagueAdmin,
    getLeagueAdmin,
    getLeague,
    setLeagueAdmin,
    getLeagueAll
}