const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const listUserModels = require('../models/listUserModels')

passport.use(new LocalStrategy(
  async function (username, password, done) {
    const user = await listUserModels.authenticateUser(username, password) 
    console.log(user);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  // console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  const user = await listUserModels.getUserByID(id);
  // console.log(user);
  done(null, user);
});

module.exports = passport;