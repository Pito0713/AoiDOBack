var express = require("express");
var router = express.Router();
const cargoController = require("../controllers/cargo.controller");
const userController = require("../controllers/user.controller");
const platformController = require("../controllers/platform.controller");
const productController = require("../controllers/product.controller");
const imageController = require("../controllers/image.controller");
const productFilter = require("../controllers/productFilter.controller");
const chartController = require("../controllers/chart.controller");
const multer = require("multer");

var upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Allowed .jpeg .jpg"));
    }
  },
});

const handleErrorAsync = require("../server/handleErrorAsync");
// logIn
router.post("/register", handleErrorAsync(userController.register));
router.post("/login", handleErrorAsync(userController.login));
router.post("/handPassWord", handleErrorAsync(userController.handPassWord));
router.post("/uploadUser", handleErrorAsync(userController.uploadUser));

// Platform
router.post("/platformRate", handleErrorAsync(platformController.platformRate));
router.post(
  "/createModifyRate",
  handleErrorAsync(platformController.createModifyRate)
);
router.delete(
  "/deleteModifyRate",
  handleErrorAsync(platformController.deleteModifyRate)
);

// chart
router.post("/chartData", handleErrorAsync(chartController.chartData));
router.post("/createChart", handleErrorAsync(chartController.createChart));
router.post("/uploadChart", handleErrorAsync(chartController.uploadChart));
router.delete("/deleteChart", handleErrorAsync(chartController.deleteChart));

// ProductFilter
router.post("/productFilter", handleErrorAsync(productFilter.productFilter));
router.post(
  "/createProductFilter",
  handleErrorAsync(productFilter.createProductFilter)
);
router.delete(
  "/deleteProductFilter",
  handleErrorAsync(productFilter.deleteProductFilter)
);

// Cargo
router.post("/searchCargo", handleErrorAsync(cargoController.searchCargo));
router.post("/addCargo", handleErrorAsync(cargoController.create));
router.post("/allCargos", handleErrorAsync(cargoController.findAll));
router.patch("/updateCargo/:id", handleErrorAsync(cargoController.updateCargo));
router.delete("/delCargo/:id", handleErrorAsync(cargoController.deleteOne));
router.delete("/delAllCargos", handleErrorAsync(cargoController.deleteAll));

// file
router.post("/allProduct", handleErrorAsync(productController.allProduct));
router.post("/addProduct", handleErrorAsync(productController.addProduct));
router.post(
  "/uploadProduct",
  handleErrorAsync(productController.uploadProduct)
);
router.delete(
  "/deleteProductOne/:id",
  handleErrorAsync(productController.deleteProductOne)
);
router.delete(
  "/deleteProductCategory",
  handleErrorAsync(productController.deleteProductCategory)
);
router.post(
  "/productDatabase",
  handleErrorAsync(productController.productDatabase)
);

// img
router.get("/allImage", handleErrorAsync(imageController.allImage));
router.post("/uploadImage", upload.single("file"), imageController.uploadImage);

module.exports = router;
