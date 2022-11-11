var express = require('express');
var router = express.Router();
const cargoController = require("../controllers/cargo.controller")
const userController = require("../controllers/user.controller")
const platformController = require("../controllers/platform.controller")
const fileController = require("../controllers/file.controller");
const multer = require('multer');

var upload = multer({
  fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ) {
          cb(null, true)
      } else {
          cb(null, false)
          return cb(new Error('Allowed .jpeg .jpg'))
      }
  }
})

const handleErrorAsync = require("../server/handleErrorAsync")
// logIn
router.post('/register', handleErrorAsync(userController.register));
router.post('/login', handleErrorAsync(userController.login));
router.post('/handPassWord', handleErrorAsync(userController.handPassWord));

// Platform
router.post('/platformRate', handleErrorAsync(platformController.platformRate));
router.post('/createModifyRate', handleErrorAsync(platformController.createModifyRate));
router.delete("/deleteModifyRate" , handleErrorAsync(platformController.deleteModifyRate));

// Cargo
router.post("/searchCargo" , handleErrorAsync(cargoController.searchCargo));
router.post('/addCargo', handleErrorAsync(cargoController.create));
router.post('/allCargos', handleErrorAsync(cargoController.findAll));
router.patch("/updateCargo/:id" , handleErrorAsync(cargoController.updateCargo));
router.delete("/delCargo/:id" , handleErrorAsync(cargoController.deleteOne));
router.delete("/delAllCargos" , handleErrorAsync(cargoController.deleteAll));

// file
router.get('/allImages',fileController.allImages);
router.post('/uploadImage',upload.single('file'),fileController.uploadImage)

module.exports = router;
