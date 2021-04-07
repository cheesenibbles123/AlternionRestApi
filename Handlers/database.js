const mysql = require('mysql');
const config = require('./../config.json');

exports.pool = connectionPool;

var connectionPool = mysql.createPool({
	connectionLimit : 30,
	host : config.databaseInfo.host,
	user : config.databaseInfo.user,
	password : config.databaseInfo.password,
	database : config.databaseInfo.database
});
