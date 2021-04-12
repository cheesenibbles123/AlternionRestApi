const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');


module.exports = {
	path: "/secondarySails",
	route: (router) => {

		router.get('/', async (req, res) => {
		  if (req.query.steamID && req.query.key && req.query.public){
		    let validKey = await db.authUser(req.query.steamID,req.query.key);
		    if (validKey.isValid){
		      let steamID = parseInt(req.query.steamID);
		      if (!isNaN(steamID)){

		      	let obj;
		      	
		      	if (parseInt(req.query.public) === 1){
		      		db.connectionPool.query(`SELECT Name, Display_Name FROM NormalSail WHERE Limited!=1`, (err,rows) => {

						if (rows.length < 1){
							obj = "No Sails found.";
						}else{
							obj = {};
							for (let i = 0; i < rows.length; i++){
								obj[`${rows[i].Name}`] = rows[i].Display_Name;
							}
						}

						responses.returnSuccess(res,obj);
					});
		      	}else{
		      		db.connectionPool.query(`SELECT Team_ID from User where Steam_ID=?`,[steamID], (err,rows1) => {
						db.connectionPool.query(`(SELECT NormalSail.Name, NormalSail.Display_Name FROM LimitedSails INNER JOIN User ON User_ID = User.ID INNER JOIN NormalSail ON Allowed_Sail_ID = NormalSail.ID WHERE User.Steam_ID=?) UNION (SELECT Name, Display_Name FROM Cannon WHERE Team_ID=${rows1[0].Team_ID} AND IF ( ${rows1[0].Team_ID} != 0, 1, 0) = 1 )`,[steamID], (err,rows) => {

							if (rows.length < 1){
								obj = "No Sails found.";
							}else{
								obj = {};
								for (let i = 0; i < rows.length; i++){
									obj[`${rows[i].Name}`] = rows[i].Display_Name;
								}
							}

							responses.returnSuccess(res,obj);
						});
					});
		      	}

		      }else{
		        responses.returnError(res,"Please check your inputs.");
		      }
		    }else{
		      responses.returnError(res,validKey.msg);
		    }
		  }else{
		    responses.returnError(res,"Missing parameters.");
		  }
		});
		
		return router;
	}
}