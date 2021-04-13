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
	return new Promise((resolve,reject) => {
		connectionPool.query(`SELECT * FROM UserKey WHERE AuthKey=?`,[key], async (err,rows) => {
			if (rows.length < 1){
				reject({isValid : false, msg : "Invalid Key"});
			}else if (rows.length > 1){
				reject({isValid : false, msg : "Duplicate key"});
			}else{
				let validAttempt = { isValid : false, msg : null};
				switch (rows[0].AuthLevel){
					case 0:
						// Self only
						validAttempt.isValid = await checkLink(steamID,rows[0].LinkedUser);
						break;
					case 1:
						// Global key
						validAttempt.isValid = true;
						break;
					default:
						validAttempt.isValid = false;
						validAttempt.msg = "Invalid key.";
						break;
				}
				resolve(validAttempt);
			}
		});
	});
}

exports.authTeamLeader = function authTeamLeader(tlSteamID, affectedSteamID, key){
	return new Promise((resolve,reject) => {
		connectionPool.query(`SELECT * FROM UserKey WHERE AuthKey=?`,[key], async (err,rows) => {
			if (rows.length < 1){
				resolve({isValid : false, msg : "Invalid Key"});
			}else if (rows.length > 1){
				resolve({isValid : false, msg : "Duplicate key"});
			}else{
				let validAttempt = { isValid : false, msg : null};
				console.log("Checking key: " + key);
				console.log(rows);
				switch (rows[0].AuthLevel){
					case 1:
						// Global key
						validAttempt.isValid = true;
						break;
					case 2:
						// Team Leader
						validAttempt.isValid = await checkTeam(affectedSteamID,tlSteamID,rows[0].LinkedUser);
					default:
						validAttempt.isValid = false;
						validAttempt.msg = "Invalid key.";
						break;
				}
				resolve(validAttempt);
			}
		});
	});
}

function checkLink(steamID,User){
	return new Promise((resolve,reject) => {
		connectionPool.query(`SELECT Steam_ID FROM User WHERE ID=${User}`, (err,rows) => {
			if (steamID === rows[0].Steam_ID){
				resolve(true);
			}else{
				resolve(false);
			}
		})
	});
}

function checkTeam(targetSteamID,executorSteamID,Team){
	return new Promise((resolve,reject) => {
		connectionPool.query(`SELECT Team_ID,Team_Leader FROM User WHERE Steam_ID=?`,[executorSteamID], (err,rows) => {
			if (rows[0].Team_Leader !== 0 && rows[0].Team_ID === Team){
				connectionPool.query(`SELECT Team_ID,Team_Leader FROM User WHERE Steam_ID=?`,[targetSteamID], (err,rows2) => {
					if (rows2[0].Team_ID === rows[0].Team_ID){
						resolve(true);
					}else{
						resolve(false);
					}
				})
			}else{
				resolve(false);
			}
		})
	});
}