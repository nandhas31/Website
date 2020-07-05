const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/connect');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./User.js');
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
    const {username,password,fName,lName,email} = req.body;
    console.log(req.body);
    const newUser = new User({username, password, fName, lName, email});
    User.findOne({username:username}).then(
      document =>{
        if(document) {
          console.log('failed')  
          return res.end('failed');
        }
        newUser.save().then(res => console.log(res));
        return res.end('completed')
      }
    ).catch(err =>{
      console.log(err)
      return res.end('db error');
    })

    


})
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log('login success');
        return res.redirect('/users/' + user.username);
      });
    })(req, res, next);
  });
//renders login page
app.get('/login', (req, res) => {
    res.render('login');
})


app.listen(8080, () => {
    console.log('app running on port 8080')
})

passport.use(new LocalStrategy(
    function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
              
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.password === password) {
         
                    return done(null, false, { message: 'Incorrect password.' });
                }
    
                return done(null, user);
            });
    }
));
const db = 'mongodb://localhost:27017' //require("./config/keys").MongoURI;
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB Connected'))
 .catch(err => console.log(err)); 
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });