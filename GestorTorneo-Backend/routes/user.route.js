"user strict"

var express = require("express");
var UserController = require("../controllers/user.controller");
var mdAuth = require("../middlewares/authenticated");

var connectMultiparty = require("connect-multiparty");
var mdUpload = connectMultiparty({uploadDir: './uploads/users'})

var api = express.Router();

api.get("/prueba", UserController.prueba);

api.post("/saveUser", UserController.saveUser);

api.post("/login", UserController.login);

api.post("/saveUserByAdmin/:id", [mdAuth.ensureAuth, mdAuth.ensureAdmin], UserController.saveUserByAdmin);

api.put("/updateUser/:id", mdAuth.ensureAuth, UserController.updateUser);

api.put("/updateUserByAdmin/:idA/:idU", [mdAuth.ensureAuth, mdAuth.ensureAdmin], UserController.updateUserByAdmin);

api.put("/removeUser/:id", mdAuth.ensureAuth, UserController.removeUser);

api.put("/removeUserByAdmin/:idA/:idU", [mdAuth.ensureAuth, mdAuth.ensureAdmin], UserController.removeUserByAdmin);

api.get("/getUsers/:id", [mdAuth.ensureAuth, mdAuth.ensureAdmin], UserController.getUsers);


api.put('/:idU/uploadImage', [mdAuth.ensureAuth, mdUpload], UserController.uploadImage);

module.exports = api;