"use strict"

var mongoose = require("mongoose");
var app = require("./app");
var port = 3800;
var userInit = require("./controllers/user.controller");

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/GestorTorneoG2", {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("Conectado a la Base de Datos");
    userInit.createInit();
    app.listen(port, ()=>{
        console.log("Servidor de Express Corriendo")
    })
})

.catch ((err)=> console.log("Error al conectar a la Base de Datos", err)) 