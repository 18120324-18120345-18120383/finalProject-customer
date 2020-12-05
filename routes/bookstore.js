var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers')

/* GET home page. */
router.use(express.static('public'));

router.get('/', listBookController.index );
router.get('/contact', listBookController.contact);
router.get('/product-detail', listBookController.productDetail);
router.get('/product-listing', listBookController.productListing);
router.get('/shop-cart', listBookController.shopCart);
module.exports = router;