const express= require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')
app.get('/signup', (req, res) =>{
    res.render('home');
})

app.post('/signup', (req, res) =>{
    console.log(req.body);
    res.redirect('/login')
})
app.post('/login', (req, res) =>{

})

app.get('/login', (req, res) =>{
    res.render('login');
})


app.listen(8080, () =>{
    console.log('app running on port 8080')
})