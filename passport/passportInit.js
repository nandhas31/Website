const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/User')
const bcrypt = require('bcryptjs');
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {

        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) {

          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);ß
      });

    });
  }
));
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
