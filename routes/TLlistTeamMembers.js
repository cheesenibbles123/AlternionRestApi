const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

module.exports = {
	path: "/listMembers",
	route: (router) => {

		router.get('/', async (req, res) => {
		  if (req.query.target && req.query.executor && req.query.key){

		  	let data = {
		  		target : parseInt(req.query.target),
		  		executor : parseInt(req.query.executor)
		  	}
		  	
		    let validKey = await db.authTeamLeader(data.executor,data.target,req.query.key);
		    if (validKey.isValid){
		      let steamID = parseInt(req.query.steamID);
		      if (!isNaN(data.target) && !isNaN(data.executor)){
		      	db.connectionPool.query(`SELECT Team_ID FROM User WHERE Steam_ID=?`,[data.target],(err,rows) => {
		      		db.connectionPool.query(`SELECT * FROM User WHERE Team_ID=?`,[rows[0].Team_ID], (err,rows2) => {
		      			if (rows2.length >= 1){
			      			let obj = [];
			      			for (let i=0; i < rows2.length; i++){
			      				obj.push({ ID : `${rows2[i].ID}`});	
			      			}
			      			responses.returnSuccess(res,obj);
			      		}else{
			      			responses.returnSuccess(res,"No members found.");
			      		}
		      		});
		      	});
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