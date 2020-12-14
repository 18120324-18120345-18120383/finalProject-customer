var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers')
const listUserController = require('../controllers/listUserControllers');

/* GET home page. */
router.use(express.static('public'));

router.get('/', checkAuthenticated, listBookController.index );
router.get('/contact', checkAuthenticated, listBookController.contact);
router.get('/product-detail/:id', checkAuthenticated, listBookController.productDetail);
router.get('/product-listing', checkAuthenticated, listBookController.productListing);
router.get('/shop-cart', checkAuthenticated, listBookController.shopCart);
router.get('/account-info', checkAuthenticated, listUserController.getAccountInfo);
router.post('/account-info', checkAuthenticated, listUserController.updateAccountInfo);
// router.get('/login', listUserController.getLogin);
router.get('/register', checkAuthenticated, listUserController.getRegister);
router.post('/register', checkAuthenticated, listUserController.postRegister);
// router.get('/add-product', listBookController.addBook);

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
  
    res.redirect('/login')
  }

module.exports = router;