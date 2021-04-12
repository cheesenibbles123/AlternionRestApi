const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const config = require('./config.json');

const app = express();
app.use(helmet());

let folder = "/routes";

let paths = [];

fs.readdirSync(__dirname + folder).forEach((file) => {

	let routeEndpoint = require(__dirname + folder + "/" + file);

	if (!paths.includes(routeEndpoint.path)){
		let router = express.Router();
		let path = folder + "/" + file;
		app.use(routeEndpoint.path,routeEndpoint.route(router));
		paths.push(routeEndpoint.path);
		console.log("Added: " + routeEndpoint.path);
	}else{
		console.log("Error loading path: " + routeEndpoint.path);
		console.log("From file: " + folder + "/" + file);
		console.log("Duplicate path found.");
	}
});

app.listen(config.port);

console.log("Ready to go!");
