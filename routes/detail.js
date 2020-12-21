var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers')

/* GET home page. */
router.use(express.static('public'));

router.get('/', checkAuthenticated, listBookController.index );
router.get(':id', checkAuthenticated, listBookController.productDetail);
// router.get('/add-product', listBookController.addBook);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/book-shop/login')
}

module.exports = router;