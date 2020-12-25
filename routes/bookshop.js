const express = require('express');
const router = express.Router();
const methodOverride = require('method-override')
const listBookController = require('../controllers/listBookControllers');
const listUserController = require('../controllers/listUserControllers');
const shopCartController = require('../controllers/shopCartController');
const passport = require('../passport/index');
/* GET home page. */
router.use(express.static('public'));
router.use(methodOverride('_method'));

router.get('/', listBookController.index);
router.get('/contact', listBookController.contact);
router.get('/product-detail/:id', listBookController.productDetail);
router.post('/add-to-cart', shopCartController.addItem);
router.get('/product-listing', listBookController.productListing);
router.get('/shop-cart', shopCartController.listItem);
router.post('/delete-item', shopCartController.deleteItem);
router.post('/update-shop-cart', shopCartController.updateQuantity)
router.post('/pay-shop-cart', checkAuthenticated, shopCartController.checkOut);
router.get('/account-info', checkAuthenticated, listUserController.getAccountInfo);
router.post('/account-info', checkAuthenticated, listUserController.updateAccountInfo);
// router.get('/get-list-account', listUserController.getListAccount);  // Them Acitive = true cho tat ca cac tai khoan
router.get('/login', checkNotAuthenticated, listUserController.login);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/book-shop/login',
  failureFlash: true
}));
router.get('/forgotPassword', checkNotAuthenticated, listUserController.forgotPassword);
router.post('/forgotPassword', listUserController.postForgotPassword);
router.get('/resetPassword/:token', listUserController.resetPassword);
router.delete('/logout', listUserController.postLogout);
router.get('/register', checkNotAuthenticated, listUserController.getRegister);
router.post('/register', listUserController.postRegister);
router.get('/verifyEmail/:token', listUserController.verifyEmail);
router.get('/changePassword', checkAuthenticated, listUserController.changePassword);
router.post('/changePassword', checkAuthenticated, listUserController.postChangePassword);

// router.get('/add-product', listBookController.addBook);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/book-shop/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  return next()
}

module.exports = router;