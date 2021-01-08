const express = require('express');
const router = express.Router();
const controllerService = require('../controllers/serviceController')

router.use(express.static('public'));

router.get('/authenticate-password',controllerService.authenPassword);
router.get('/product-listing', controllerService.productsListing);
router.get('/product-detail', controllerService.productDetail);
router.get('/add-to-cart', controllerService.addOneItem);
router.get('/province', controllerService.getDistricts);
router.get('/district', controllerService.getWards);
router.get('/delete-cart-item', controllerService.deleteCartItem);
router.get('/change-quantity', controllerService.changeQuantity);
module.exports = router;
