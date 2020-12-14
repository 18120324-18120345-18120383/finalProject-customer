let express = require('express');
let router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

router.use(express.urlencoded({ extended:false }))
router.use(flash())
router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

initializePassport(
  passport,
  getUserByUsername,
  getUserById
)

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', checkNotAuthenticated,function(req, res, next){
  res.render('login');
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      return next()
  }

  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      res.redirect('/');
  }
  else{
      return next()
  }
}
function initializePassport(passport, getUserByUsername, getUserById){
  const authenticateUser = async (username, password, done) => {
      const user = getUserByUsername(username)
      if (user == null){
          return done(null, false, {message: "Username or password is incorrect!!!"})
      }

      try{
          if (password === user.password){
              console.log(password)
              return done(null, user)
          }
          else{
              return done(null, false, {message: "Username or password is incorrect!!!"})
          }
      }
      catch (e) {
          return done(e)
      }
  }

  passport.use(new LocalStrategy({
      usernameField: 'username'
  }, 
  authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
  })
}

const users = []
users.push(
  {
    id: 1,
    username: "duc",
    password: "123456"
  },
  {
      id: 2,
      username: "duy",
      password: "abcdef"
  }
)

function getUserByUsername(username){
  return users.find(user => user.username == username)
}
function getUserById(id){
  return users.find(user => user.id = id)
}

module.exports = router;
