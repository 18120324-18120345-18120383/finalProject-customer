var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers')

/* GET home page. */
router.use(express.static('public'));

router.get('/', listBookController.index );
router.get('/contact', listBookController.contact);
router.get('/product-detail/:id', listBookController.productDetail);
router.get('/product-listing', listBookController.productListing);
router.get('/shop-cart', listBookController.shopCart);
// router.get('/add-product', listBookController.addBook);
module.exports = router;