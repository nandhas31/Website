const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/connect');
const passport = require('passport');
var passportInit = require('./passport/passportInit');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./db/User');
const mongoose = require('mongoose');
const session = require("express-session");
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')

//Renders sign up page
app.get('/signup', (req, res) => {
  res.render('signup');
})
//Check if user exists and if not adds to mongoDB users collection
app.post('/signup', (req, res) => {
  const { username, password, fName, lName, email } = req.body;
  console.log(req.body);
  const newUser = new User({ username, password, fName, lName, email });
  User.findOne({ username: username }).then(
    document => {
      if (document) {
        console.log('failed')
        return res.end('failed');
      }
      newUser.save().then(res => console.log(res));
      return res.end('completed')
    }
  ).catch(err => {
    console.log(err)
    return res.end('db error');
  })
})
//logs in user
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('made it here')
      return res.render('login', { errMsg: 'Incorrect Password' });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      console.log('login success');
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
//renders login page
app.get('/login', (req, res) => {
  res.render('login', { errMsg: null});
})


app.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user })
})
app.listen(8080, () => {
  console.log('app running on port 8080')
})

