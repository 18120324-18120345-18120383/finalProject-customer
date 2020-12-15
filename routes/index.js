let express = require('express');
let router = express.Router();


const listBookController = require('../controllers/listBookControllers');
const listUserController = require('../controllers/listUserControllers');




/* GET home page. */
router.get('/', listUserController.index);



module.exports = router;
