let express = require('express');
let router = express.Router();

const listUserController = require('../controllers/listUserControllers');

/* GET home page. */
router.get('/', checkAuthenticated, listUserController.index);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/book-shop/login')
}

module.exports = router;
