const express = require('express');
const helmet = require('helmet');

const config = require('./config.json');

const app = express();

app.use(helmet())

app.get('/overview', function (req, res) {
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
 
app.listen(config.port, () => {
  console.log("Listening on port:" + config.port);
});