const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const config = require('./config.json');

const app = express();
app.use(helmet());

let folder = "/routes";

fs.readdirSync(__dirname + folder).forEach((file) => {
	let router = express.Router();
	let path = folder + "/" + file;
	let routeEndpoint = require(__dirname + folder + "/" + file);
	app.use(routeEndpoint.path,routeEndpoint.route(router));
	console.log("Added: " + routeEndpoint.path);
});

app.listen(config.port);

console.log("Ready to go!");
