const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url, {useUnifiedTopology:true});

// Use connect method to connect to the Server
module.exports = function(action){
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  let completed = action(db, function(){
    client.close();
  })  
  if (!completed){
      console.log('Already Exists')
  }
  
});
}