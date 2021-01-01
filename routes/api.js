const express = require('express');
const router = express.Router();
const controllerService = require('../controllers/serviceController')

router.use(express.static('public'));

router.get('/authenticate-password',controllerService.authenPassword);
router.get('/product-listing', controllerService.productsListing);
router.get('/product-detail', controllerService.productDetail);
module.exports = router;
