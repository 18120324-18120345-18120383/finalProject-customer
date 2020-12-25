const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const listUserModels = require('../models/listUserModels')

passport.use(new LocalStrategy(
  async function (username, password, done) {
    const user = await listUserModels.authenticateUser(username, password)
    if (!user.username) {
      return done(null, false, { message: user });
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  const user = await listUserModels.getUserByID(id);
  done(null, user);
});

module.exports = passport;