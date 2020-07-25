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
const bcrypt = require ('bcryptjs');
const validateEmail = require('./util/validateEmail');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(session({ secret: "cats", resave: true, saveUninitialized: false }));
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
        if (!username ||!password ||!fName ||!lName ||!email){  
            return res.send({success:false, message:'Missing Info'});
        }
        if (!validateEmail(email)) return res.send({success:false, message:'Invalid Email'});
        if (password.length < 6 || username.length < 6) return res.end('missinginfo');
        const newUser = new User({ username, password, fName, lName, email });
        User.findOne({ username: username }).then(
            document => {
                if (document) {
                    return res.send({success:false, message:'failed'});
                }
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt,(err, hash)=>{
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save();
                        res.send({success: true, message: 'completed'});
                    })
                })
                newUser.save();
                return res.send({success:true, message:'completed'})
            }
        ).catch(err => {
            return res.send({success:false, message:'db error'});
        })
    })
    //logs in user
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send({success:false, message: 'Invalid Credentials'});
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({success: true,message:'success'});
        });
    })(req, res, next);
});
//renders login page
app.get('/login', (req, res) => {
    res.render('login', { errMsg: null });
})


app.get('/dashboard', (req, res) => {
        if (req.user)
            res.render('dashboard', { user: req.user })
        else {
            res.render('login', {errMsg:null});
        }
    })
    //logs out user
app.get('/logout', (req, res) => {
    req.logout();
    res.render('login', { errMsg: 'Successfully logged out' });
})

app.get('/edit', (req, res)=>{
    if (!req.user) return res.render('login', {errMsg:null});
    res.render('edit');
})
app.post('/changePassword', (req, res) =>{
    if (!req.user) return res.send({success:false, message:'Forbidden'});
    bcrypt.compare(req.body.oldPassword, req.user.password).then(
        result =>{
            if (!result) res.send({sucess:false, message:'Wrong Password'});
            else {
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(req.body.newPassword, salt,(err, hash)=>{
                        if (err) throw err;
                        User.findOneAndUpdate({username:req.user.username, password:req.user.password}, {password:hash}, (err, doc)=>{
                            if (err) {
                                res.send({success:false, message:'unknown error'});
                                throw err;
                            }
                            else{
                                res.send({success:true,message:'completed'});
                            }
                        })
                    })
                })
                
            }
        }).catch(err =>{throw err})
})
app.listen(8080, () => {
    console.log('app running on port 8080')
})
