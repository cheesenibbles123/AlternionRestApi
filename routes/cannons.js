const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

module.exports = {
	path: "/cannons",
	route: (router) => {

		router.get('/', async (req, res) => {
		  if (req.query.steamID && req.query.key){
		    let validKey = await db.authUser(req.query.steamID,req.query.key);
		    if (validKey.isValid){
		      let steamID = parseInt(req.query.steamID);
		      if (!isNaN(steamID)){

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