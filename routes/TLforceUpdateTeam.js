const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

module.exports = {
	path: "/forceUpdate",
	route: (router) => {
		router.get("/", (req,res) => {
			let data = req.query;
			if (data.executor && data.key && data.type && data.id){
				let validKey = await db.authTeamLeader(data.executor,data.key);
				if (validKey.isValid){
					if (data.id.includes(" ")){
						responses.returnError("Please check your inputs.");
					}else{
						db.connectionPool.query(`SELECT * FROM User WHERE Steam_ID=?`,[data.executor],(err,rows) => {
							if (typeof(rows) === undefined || rows.length < 1 || rows.length > 1){
								responses.returnError(res,"Please check your inputs.");
							}else{

								if (rows[0].Team_Leader === 0){
									responses.returnError(res,"This command is for team leaders only.");
								}else{

									let table;
									let field;

									switch(data.type){
										case "badge":
											table = "Badge";
											field = "Badge_ID";
											break;
										case "mainSail":
											table = "mainSail";
											field = "Main_Sail_ID";
											break;
										case "secondarySail":
											table = "normalSail";
											field = "Sail_ID";
											break;
										default:
											table = null;
											break;
									}

									if (!table === null){
										db.connectionPool.query(`SELECT * FROM ? WHERE Name=?`,[table,data.id],(err,rows2) => {
											if (typeof(rows) === undefined || rows2.length < 1 || rows2.length > 1){
												responses.returnError(res,"Invalid id/type");
											}else if (rows2[0].Team_ID !== rows[0].Team_Leader){
												responses.returnError(res,"Item not found.");
											}else{
												db.connectionPool.query(`UPDATE User SET ${field}=${rows2[0].ID} WHERE Team_ID=${rows[0].Team_ID}`);
												responses.sendSuccess(res,"User(s) updated!");
											}
										});
									}
								}

							}
						});
					}
				}else{
		      		responses.returnError(res,validKey.msg);
		    	}
			}else{
		    	responses.returnError(res,"Missing parameters.");
		 	}
		});
		return router;
	},
};