const express = require('express');
const helmet = require('helmet');
const db = require("Handlers/database.js");

const config = require('./config.json');

const app = express();
app.use(helmet());

app.get('/overview', function (req, res) {
  if (req.query.steamID){
    let steamID = parseInt(req.query.steamID);
    if (!isNaN(steamID)){
      db.pool.query(`SELECT * FROM User WHERE Steam_ID=?`,[steamID], (err,rows) => {
        if (rows.length < 1){
          res.send();
        }
      })
    }else{

    }
  }else{
    res.send("Missing parameters");
  }
});

app.get('/internal', function (req, res) {
  if (req.query.steamID){
    if (req.query.steamID === "test123"){
      res.send("Correct steamID!");
    }else{
      res.send("Incorrect steamID!");
    }
  }else{
    res.send("Missing parameters");
  }
});

app.get('/', function (req,res) {
  res.send("Invalid api query.");
});
 
app.listen(config.port, () => {
  console.log("Listening on port:" + config.port);
});