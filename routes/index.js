var express = require('express');
var router = express.Router();
const cargoController = require("../controllers/cargo.controller")
const userController = require("../controllers/user.controller")
const handleErrorAsync = require("../server/handleErrorAsync")

router.post('/register', handleErrorAsync(userController.register));

router.post('/login', handleErrorAsync(userController.login));

router.post('/addCargo', handleErrorAsync(cargoController.create));

router.get('/allCargos', handleErrorAsync(cargoController.findAll));

router.patch("/updateCargo/:id" , handleErrorAsync(cargoController.updateCargo));

router.delete("/delCargo/:id" , handleErrorAsync(cargoController.deleteOne));

router.delete("/delAllCargos" , handleErrorAsync(cargoController.deleteAll));

module.exports = router;
