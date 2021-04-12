const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');
const sharedFunctions = require("./_sharedFunctions");

module.exports = {
	path: "/flags",
	route: (router) => {

		router.get('/', async (req, res) => {
		  if (req.query.steamID && req.query.key && req.query.public){
		    let validKey = await db.authUser(req.query.steamID,req.query.key);
		    if (validKey.isValid){
		      let steamID = parseInt(req.query.steamID);
		      if (!isNaN(steamID)){

		      	let obj;
		      	
		      	if (parseInt(req.query.public) === 1){
		      		db.connectionPool.query(`SELECT Name, Display_Name FROM Flag WHERE Limited!=1`, (err,rows) => {

						obj = sharedFunctions.loopRows(rows,"Flags");

						responses.returnSuccess(res,obj);
					});
		      	}else{
		      		db.connectionPool.query(`SELECT Team_ID from User where Steam_ID=?`,[steamID], (err,rows1) => {
						db.connectionPool.query(`(SELECT Flag.Name, Flag.Display_Name FROM LimitedFlags INNER JOIN User ON User_ID = User.ID INNER JOIN Flag ON Allowed_Flag_ID = Flag.ID WHERE User.Steam_ID=?) UNION (SELECT Name, Display_Name FROM Flag WHERE Team_ID=${rows1[0].Team_ID} AND IF ( ${rows1[0].Team_ID} != 0, 1, 0) = 1 )`,[steamID], (err,rows) => {

							obj = sharedFunctions.loopRows(rows,"Flags");

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