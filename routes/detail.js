var express = require('express');
var router = express.Router();
const listBookController = require('../controllers/listBookControllers')

/* GET home page. */
router.use(express.static('public'));

router.get('/', listBookController.index );
router.get(':id', listBookController.productDetail);
// router.get('/add-product', listBookController.addBook);
module.exports = router;