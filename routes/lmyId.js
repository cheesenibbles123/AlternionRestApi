const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

module.exports = {
	path: "/myId",
	route: (router) => {
		router.get("/", (req,res) => {
			if (req.query.steamId && req.query.key){
				let validKey = db.authUser(req.query.steamid,req.query.key);
				if (validKey.isValid && !isNaN(parseInt(req.query.steamId))){
					db.connectionPool.query(`SELECT ID FROM User WHERE Steam_ID=?`,[req.query.steamId],(err,rows) => {
						if (rows.length < 1 || rows.length > 1){
							responses.returnError(res,"Invalid steamid");
						}else{
							responses.returnSuccess(res,rows[0].ID);
						}
					})
				}
			}
		});
		return router;
	},
};