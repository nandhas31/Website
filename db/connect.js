const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017' //require("./config/keys").MongoURI;
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB Connected'))
 .catch(err => console.log(err)); 
