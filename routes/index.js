let express = require('express');
let router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

const listUserModels = require('../models/listUserModels')
const listBookController = require('../controllers/listBookControllers');
const listUserController = require('../controllers/listUserControllers');

router.use(express.urlencoded({ extended: false }))
router.use(flash())
router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))



/* GET home page. */
router.get('/', checkAuthenticated, listUserController.index);

router.get('/login', checkNotAuthenticated, listUserController.login);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
router.delete('/logout', listUserController.postLogout);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    else {
        return next()
    }
}


module.exports = router;
