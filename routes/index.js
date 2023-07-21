var express = require('express');
var router = express.Router();
const couponController = require('../controllers/coupon.controller');
const userController = require('../controllers/user.controller');
const userBackController = require('../controllers/userBack.controller');
const platformController = require('../controllers/platform.controller');
const productController = require('../controllers/product.controller');
const imageController = require('../controllers/image.controller');
const productFilter = require('../controllers/productFilter.controller');
const cartController = require('../controllers/cart.controller');
const countryController = require('../controllers/country.controller');
const carouselImgController = require('../controllers/carouselImg.controller');
const aboutImgController = require('../controllers/aboutImg.controller');
const mainImgController = require('../controllers/mainImg.controller');
const multer = require('multer');

var upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Allowed .jpeg .jpg'));
    }
  },
});

const handleErrorAsync = require('../server/handleErrorAsync');
// user
router.post('/register', handleErrorAsync(userController.register));
router.post('/login', handleErrorAsync(userController.login));
router.post('/handPassWord', handleErrorAsync(userController.handPassWord));
router.post('/userinfo', handleErrorAsync(userController.userinfo));
router.post('/uploadUser', handleErrorAsync(userController.uploadUser));
router.post(
  '/uploadUserImage',
  upload.single('file'),
  userController.uploadUserImage
);

// Platform
router.post('/platformRate', handleErrorAsync(platformController.platformRate));
router.post(
  '/createModifyRate',
  handleErrorAsync(platformController.createModifyRate)
);
router.post(
  '/updateModifyRate',
  handleErrorAsync(platformController.updateModifyRate)
);
router.delete(
  '/deleteModifyRate',
  handleErrorAsync(platformController.deleteModifyRate)
);

// cart
router.post('/cartData', handleErrorAsync(cartController.cartData));
router.post('/createCart', handleErrorAsync(cartController.createCart));
router.post('/uploadCart', handleErrorAsync(cartController.uploadCart));
router.delete('/deleteCart', handleErrorAsync(cartController.deleteCart));

// ProductFilter
router.post('/productFilter', handleErrorAsync(productFilter.productFilter));
router.post(
  '/createProductFilter',
  handleErrorAsync(productFilter.createProductFilter)
);
router.delete(
  '/deleteProductFilter',
  handleErrorAsync(productFilter.deleteProductFilter)
);

// Coupon
router.post('/createCoupon', handleErrorAsync(couponController.createCoupon));
router.post('/findAllCoupon', handleErrorAsync(couponController.findAllCoupon));
router.post('/searchCoupon', handleErrorAsync(couponController.searchCoupon));
router.patch(
  '/updateCoupon/:id',
  handleErrorAsync(couponController.updateCoupon)
);
router.patch(
  '/updateCouponUser/:id',
  handleErrorAsync(couponController.updateCouponUser)
);
router.delete(
  '/deleteOneCoupon/:id',
  handleErrorAsync(couponController.deleteOneCoupon)
);
router.delete(
  '/deleteAllCoupon',
  handleErrorAsync(couponController.deleteAllCoupon)
);

// Product
router.post('/allProduct', handleErrorAsync(productController.allProduct));
router.post('/addProduct', handleErrorAsync(productController.addProduct));
router.post(
  '/uploadProduct',
  handleErrorAsync(productController.uploadProduct)
);
router.delete(
  '/deleteProductOne/:id',
  handleErrorAsync(productController.deleteProductOne)
);
router.delete(
  '/deleteProductCategory',
  handleErrorAsync(productController.deleteProductCategory)
);
router.post(
  '/productDatabase',
  handleErrorAsync(productController.productDatabase)
);

// img
router.get('/allImage', handleErrorAsync(imageController.allImage));
router.post('/uploadImage', upload.single('file'), imageController.uploadImage);

// country
router.post('/addCountry', handleErrorAsync(countryController.create));
router.get('/allCountry', handleErrorAsync(countryController.allCountry));

// Carousel
router.post(
  '/createCarouselImg',
  handleErrorAsync(carouselImgController.createCarouselImg)
);
router.get(
  '/findAllCarouselImg',
  handleErrorAsync(carouselImgController.findAllCarouselImg)
);
router.patch(
  '/uploadCarouselImg',
  handleErrorAsync(carouselImgController.uploadCarouselImg)
);
router.delete(
  '/deleteOneCarouselImg/:id',
  handleErrorAsync(carouselImgController.deleteOneCarouselImg)
);

router.get(
  '/findActiveCarouselImg',
  handleErrorAsync(carouselImgController.findActiveCarouselImg)
);

// About
router.post(
  '/createAboutImg',
  handleErrorAsync(aboutImgController.createAboutImg)
);
router.get(
  '/findAllAboutImg',
  handleErrorAsync(aboutImgController.findAllAboutImg)
);
router.patch(
  '/uploadAboutImg',
  handleErrorAsync(aboutImgController.uploadAboutImg)
);
router.delete(
  '/deleteOneAboutImg',
  handleErrorAsync(aboutImgController.deleteOneAboutImg)
);

router.get(
  '/findActiveAboutImg',
  handleErrorAsync(aboutImgController.findActiveAboutImg)
);

// Main
router.post(
  '/createMainImg',
  handleErrorAsync(mainImgController.createMainImg)
);
router.get(
  '/findAllMainImg',
  handleErrorAsync(mainImgController.findAllMainImg)
);
router.patch(
  '/uploadMainImg',
  handleErrorAsync(mainImgController.uploadMainImg)
);
router.delete(
  '/deleteOneMainImg',
  handleErrorAsync(mainImgController.deleteOneMainImg)
);

router.get(
  '/findActiveMainImg',
  handleErrorAsync(mainImgController.findActiveMainImg)
);

// userBack
router.post(
  '/userBackRegister',
  handleErrorAsync(userBackController.userBackRegister)
);
router.post(
  '/userBackLogin',
  handleErrorAsync(userBackController.userBackLogin)
);
router.post(
  '/userBackhandPassWord',
  handleErrorAsync(userBackController.userBackhandPassWord)
);
router.get('/userBackInfo', handleErrorAsync(userBackController.userBackInfo));

router.post(
  '/findAllUserBack',
  handleErrorAsync(userBackController.findAllUserBack)
);

router.patch(
  '/uploadUserPermission',
  handleErrorAsync(userBackController.uploadUserPermission)
);

module.exports = router;
