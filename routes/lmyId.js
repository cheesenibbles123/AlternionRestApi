const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

module.exports = {
	path: "/myId",
	route: (router) => {
		router.get("/", async (req,res) => {
			if (req.query.steamId && req.query.key){
				let validKey = await db.authUser(req.query.steamid,req.query.key);
				let response = await db.getUser(steamID);
				if (response.isValid){
					responses.returnSuccess(res, response.data.ID);
				}else{
					responses.returnError(res, response.msg);
				}
			}
		});
		return router;
	},
};