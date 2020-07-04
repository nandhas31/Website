const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/connect');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')

//Renders sign up page
app.get('/signup', (req, res) => {
    res.render('signup');
})
//Check if user exists and if not adds to mongoDB users collection
app.post('/signup', (req, res) => {
    console.log(req.body);
    dbConnect(function (db, cb) {
        const collection = db.collection('users');
        collection.findOne({ username: req.body.username }).then(doc => {
            if (doc) return false;
            collection.insertOne({ username: req.body.username, password: req.body.password, firstName: req.body.fname, lastName: req.body.lname, email: req.body.email }, (err, result) => {
                if (err) console.log(err);
                cb();
                res.redirect('login')
                return true;

            });
        });
    })
    
   
})
app.post('/login', (req, res) => {

})
//renders login page
app.get('/login', (req, res) => {
    res.render('login');
})


app.listen(8080, () => {
    console.log('app running on port 8080')
})