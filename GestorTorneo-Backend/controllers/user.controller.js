"use strict"

var User =  require("../models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

function prueba(req, res){
    res.status(200).send({message: 'Todo correcto'})
}

function createInit (req,res){
    let user = new User();
    user.username ="admin";
    user.password = "deportes123";
    user.role = "ADMIN_ROLE"

    if(user.username && user.password){
        User.findOne({username: user.username}, (err,userFind)=>{
            if(err){
                console.log("Error general",  err)
            }else if(userFind){
                console.log("Administrador ya creado");
            }else{
                bcrypt.hash(user.password,null,null,(err, passwordhash)=>{
                    if(err){
                        console.log("Error general",  err)
                    }else if(passwordhash){
                        user.password = passwordhash;
                        user.username = "admin";
                        user.role = "ADMIN_ROLE";
                        
                        user.save((err, userSaved)=>{
                            if(err){
                                console.log("Error al crear el administrador");
                            }else if(userSaved){
                                console.log("Usuario administrador creado");
                            }else{
                                console.log("Usuario administrador no creado");
                            }
                        }) 
                    }
                })
            }
        })
    }else{
        res.status(403).send({message:"Error al crear el admin"});
    }

}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.password){
        User.findOne({username: params.username}, (err, userFind)=>{
           if(err){
            return res.status(500).send({message:"Error general, Vuelva a intentarlo mas tarde"})
           }else if(userFind){
             return res.send({message:"Nombre de usuario No disponible"});
           }else{
            bcrypt.hash(params.password, null, null, (err, passwordhash)=>{
                if(err){
                    return res.status(500).send({message:"Error General"})
                }else if(passwordhash){
                    user.name = params.name;
                    user.lastname = params.lastname;
                    user.username = params.username.toLowerCase();
                    user.password = passwordhash;
                    user.role = "USER_ROLE";

                    user.save((err,  userSaved)=>{
                        if(err){
                            return res.status(500).send({message:"Error General al Guardar el Usuario"});
                        }else if(userSaved){
                            return res.send({message: "Usuario Guardado Exitosamente", userSaved})
                        }else{
                            return res.status(500).send({message:"No se Guardo el Usuario"})
                        }
                    })

                }else{
                    return res.status(403).send({message: 'La contrase??a no se ha encriptado'});
                }
            })
           } 
        })
    }else{
        return res.status(401).send({message: "Por favor env??a los datos m??nimos para la creaci??n de tu cuenta"})
    }
}

function login(req,res){
    var params = req.body;
    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message:"Error General"})
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message:"Error General al Comparar Contrase??as"})
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({
                                token: jwt.createToken(userFind),
                                user: userFind
                            })
                        }else{
                            return res.send({message: "Usuario Logeado"})
                        }
                    }else{
                        return res.status(403).send({message: "Usuario o Contrase??a incorrectos"})
                    }
                })
            }else{
                return res.status(401).send({message: 'Cuenta de usuario no encontrada'});
            }
        })
    }else{
        return res.status(404).send({message: 'Por favor env??a los campos obligatorios'});
    }
}

function saveUserByAdmin(req, res){
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(userId != req.user.sub){
        res.status(401).send({message:"No tienes permiso para crear usuarios Administradores"})
    }else{
        if(params.name && params.username && params.password){
            User.findOne({username:params.username}, (err, UserFind)=>{
                if(err){
                    return res.status(500).send({message:"Error General en el servidor"});
                }else if(UserFind){
                    return res.send({message:"Nombre de Usuario ya en uso"})
                }else{
                    bcrypt.hash(params.password, null, null, (err,passwordhash)=>{
                        if(err){
                            return res.status(500).send({message:"Error General en la Encriptaci??n"})
                        }else if(passwordhash){
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.username = params.username.toLowerCase();
                            user.password = passwordhash;
                            user.role = params.role;

                            user.save((err, userSaved)=>{
                                if(err){
                                    return res.status(500).send({message: "Error General al Guardar"})
                                }else if(userSaved){
                                    return res.send({message: "Usuario Guardado", userSaved})
                                }else{
                                    return res.status(500).send({message: "No se Guardo el usuario "})
                                }
                            })
                        }else{
                            return res.status(401).send({message: 'Contrase??a no encriptada'});
                        }
                    })
                }
            })
        }else{
            return res.send({message: 'Por favor ingresa los datos obligatorios'});
        }
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:"No tienes permiso para realizar esta acci??n"})
    }else{
        if(update.password || update.role){
            return res.status(500).send({message : "No es posible actualizar la contrase??a y el role desde esta funci??n"})
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return  res.status(500).send({message:"Error General"})
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: "Error General al Actualizar"})
                                }else if(userUpdated){
                                    return res.send({message: "Usuario Actualizado", userUpdated})
                                }else{
                                    return res.send({message: "No se pudo Actualizar al Usuario"})
                                }
                            })
                        }else{
                            return res.send({message: "Nombre de usuario ya en uso"})
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error General al Actualizar"})
                            }else if(userUpdated){
                                return res.send({message: "Usuario Actualizado", userUpdated})
                            }else{
                                return res.send({message:"No se pudo actualizar al usuario"})
                            }
                        })
                    }
                })
            }else{
                user.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error General al Actualizar"})
                    }else if(userUpdated){
                        return res.send({message: "Usuario Actualizado", userUpdated})
                    }else{
                        return res.send({message:"No se pudo actualizar al usuario"})
                    }
                })
            }
        }
    }
}

function updateUserByAdmin(req,res){
    let userId = req.params.idU;
    let userAdminId = req.params.idA;
    let update = req.body;

    if( userAdminId != req.user.sub){
        return res.status(404).send({message:"No tienes permiso para realizar esta acci??n"})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: "Error en la busqueda"})
            }else if(userFind){
                if(userFind.role == "ADMIN_ROLE"){
                    return res.status(500).send({message: "No es posible actualizar  otro Administrador"})
                }else{
                    if(update.password){
                        return res.status(500).send({message : "No es posible actualizar la contrase??a desde esta funci??n"})
                    }else{
                        if(update.username){
                            User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                                if(err){
                                    return  res.status(500).send({message:"Error General"})
                                }else if(userFind){
                                    if(userFind._id == req.user.sub){
                                        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated))
                                        if(err){
                                            return res.status(500).send({message: "Error General al Actualizar"})
                                        }else if(userUpdated){
                                            return res.send({message: "Usuario Actualizado", userUpdated})
                                        }else{
                                            return res.send({message: "No se pudo Actualizar al Usuario"})
                                        }
            
                                    }else{
                                        return res.send({message: "Nombre de usuario ya en uso"})
                                    }
                                }else{
                                    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message: "Error General al Actualizar"})
                                        }else if(userUpdated){
                                            return res.send({message: "Usuario Actualizado", userUpdated})
                                        }else{
                                            return res.send({message:"No se pudo actualizar al usuario"})
                                        }
                                    })
                                }
                            })
                        }else{
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: "Error General al Actualizar"})
                                }else if(userUpdated){
                                    return res.send({message: "Usuario Actualizado", userUpdated})
                                }else{
                                    return res.send({message:"No se pudo actualizar al usuario"})
                                }
                            })
                        }
                    }
                }
            }else{
                return res.status(404).send({message: "Error en la busqueda, vuelva a intendarlo m??s tarde"})
            }

        })
    }

}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: "No tienes permiso para realizar esta acci??n"})
    }else{
        if(!params.password){
            return res.status(401).send({message: "Por favot ingresa la contrase??a para poder eliminar tu cuenta"})
        }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: "Error General"})
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            return res.status(500).send({message:"Error General al verificar contrase??a"})
                        }else if(checkPassword){
                            User.findByIdAndRemove(userId, (err, userFind)=>{
                                if(err){
                                    return res.status(500).send({message: "Error General al verificar contrase??a"})
                                }else if(userFind){
                                    return res.send({message: "Usuario Eliminado", userRemoved:userFind})
                                }else{
                                    return res.status(404).send({message: "Usuario no encontrado o ya eliminado"})
                                }
                            })
                        }else{
                             return res.status(403).send({message: "Contrase??a incorrecta, solo con tu contrase??a podr??s eliminar tu usuario "})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario inexistente o ya eliminado'})
                }
            })
        }
    }
}

function removeUserByAdmin(req, res){
    let userId = req.params.idU;
    let userAdminId = req.params.idA;

    if(userAdminId != req.user.sub){
        return res.status(403).send({message: "No tienes permiso para realizar esta acci??n"});
    }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: "Error General", err})
                }else if(userFind){
                    if(userFind.role == "ADMIN_ROLE"){
                        return res.status(500).send({message: "No es posible eliminar a otro usuario Administrador"})
                    }else{
                        User.findByIdAndRemove(userId, (err, userFind)=>{
                            if(err){
                                return res.status(500).send({message: "Error General", err})
                            }else if(userFind){
                                return res.send({message: "Usuario Eliminado", userRemoved:userFind})
                            }else{
                                return res,status(404).send({message: "Usuario no encontrado o ya eliminado"})
                            }
                        })
                    }
                }else{
                return res.status(404).send({message: 'Usuario inexistente o ya eliminado'})
            }
        })
    }
}

function getUsers(req, res){
    let userId = req.params.id;

        if(userId != req.user.sub){

            return res.status(500).send({message: "No tienes permiso para realizar esta acci??n"})
         }else{
            User.find({}).populate("users").exec((err, users)=>{
                if(err){
                    return res.status(500).send({message: "Error general", err})
                }else if(users){
                    return res.send({message: "Usuarios encontrados", users})
                }else{
                    return res.status(404).send({message: "No hay registros"})
                }
         })
        }
    }
    
    function uploadImage(req, res){
        var userId = req.params.idU;
        var fileName = 'Sin imagen';
    
        if(userId != req.user.sub){
            res.status(403).send({message: 'No tienes permisos'});
        }else{
            if(req.files){
                var filePath = req.files.image.path;
                var fileSplit = filePath.split('\\');
                var fileName = fileSplit[2];
                var ext = fileName.split('\.');
                var fileExt = ext[1];
                if( fileExt == 'png' ||
                    fileExt == 'jpg' ||
                    fileExt == 'jpeg' ||
                    fileExt == 'gif'){
                        User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'});
                            }else if(userUpdated){
                                return res.send({user: userUpdated, userImage: userUpdated.image});
                            }else{
                                return res.status(404).send({message: 'No se actualiz??'});
                            }
                        })
                    }else{
                        fs.unlink(filePath, (err)=>{
                            if(err){
                                return res.status(500).send({message: 'Error al eliminar y la extensi??n no es v??lida'});
                            }else{
                                return res.status(403).send({message: 'Extensi??n no v??lida, y archivo eliminado'});
                            }
                        })
                    }
            }else{
                return res.status(404).send({message: 'No has subido una imagen'});
            }
        }
    }

    function getImage (req, res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/' + fileName;
    
        fs.exists(pathFile, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(pathFile))
            }else{
                return res.status(404).send({message: 'Imagen inexistente'});
            }
        })
    }
module.exports = {
    prueba,
    createInit,
    saveUser,
    login,
    saveUserByAdmin,
    updateUser,
    updateUserByAdmin,
    removeUser,
    removeUserByAdmin,
    getUsers,
    getImage,
    uploadImage
    
}
