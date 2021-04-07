const mysql = require('mysql');
const config = require('./../config.json');

const connectionPool = mysql.createPool({
	connectionLimit : 30,
	host : config.databaseInfo.host,
	user : config.databaseInfo.user,
	password : config.databaseInfo.password,
	database : config.databaseInfo.database
});

exports.connectionPool = connectionPool;

exports.authUser = function authUser(steamID,key){
	connectionPool.query(`SELECT * FROM UserKey WHERE AuthKey=?`,[key], (err,rows) => {
		if (rows.length < 1){
			return {isValid : false, msg : "Invalid Key"}
		}else if (rows.lenth > 1){
			return {isValid : false, msg : "Duplicate key"}
		}else{
			let validAttempt = false;
			switch (rows[0].AuthLevel){
				case 0:
					// Self only
					validAttempt = checkLink(steamID,rows[0].LinkedUser);
					break;
				case 1:
					// Global key
					validAttempt = true;
					break;
				default:
					validAttempt = false;
					break;
			}

			return validAttempt;
		}
	});
}

async function checkLink(steamID,User){
	let promise = new Promise((resolve,reject) => {
		connectionPool.query(`SELECT Steam_ID FROM User WHERE ID=${User}`, (err,rows) => {
			if (steamID === rows[0].Steam_ID){
				resolve(true);
			}else{
				resolve(false);
			}
		})
	});

	let result = await promise;
	return result;
}