var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers');
const listUserController = require('../controllers/listUserControllers');
const passport = require('../passport/index');

/* GET home page. */
router.use(express.static('public'));

router.get('/', listBookController.index);
router.get('/contact', listBookController.contact);
router.get('/product-detail/:id', listBookController.productDetail);
router.get('/product-listing', listBookController.productListing);
router.get('/shop-cart', listBookController.shopCart);
router.get('/account-info', listUserController.getAccountInfo);
router.post('/account-info', listUserController.updateAccountInfo);
router.get('/login', listUserController.login);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/book-shop/login?error=wrong-account',
  failureFlash: false
}));
router.delete('/logout', listUserController.postLogout);
router.get('/register', listUserController.getRegister);
router.post('/register', listUserController.postRegister);
// router.get('/add-product', listBookController.addBook);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/book-shop/login')
}

module.exports = router;