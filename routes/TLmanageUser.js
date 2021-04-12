const db = require('./../Handlers/database.js');
const responses = require('./../Handlers/responses.js');

function main(data,req,res){
	if ((data.target && data.executor && data.type) || (data.executor && data.id && data.type)){
		if ((!isNaN(parseInt(data.target)) && !isNaN(parseInt(data.executor))) || (!isNaN(parseInt(data.id)) && !isNaN(parseInt(data.executor)))){

			db.connectionPool.query(`SELECT Team_ID,Team_Leader FROM User WHERE Steam_ID=?`,[data.executor],(err,rows) => {
				if (rows.length < 1 || rows.length > 1){
					responses.returnError(res,"Check your input data.");
				}else if (rows[0].Team_Leader === 0 || rows[0].Team_ID === 0){
					responses.returnError(res,"Team Leaders only.")
				}else{

					let sql = data.target ? `SELECT Team_ID FROM User WHERE Steam_ID=?` : `SELECT Team_ID FROM User WHERE ID=?`;
					let item = data.target ? data.target : data.id;

					let sql3 = data.target ? `UPDATE User SET Team_ID=0 WHERE Steam_ID=?` : `UPDATE User SET Team_ID=0 WHERE ID=?`
					let item3 = data.target ? data.target : data.id;

					let sql2 = data.target ? `UPDATE User SET Team_ID=? WHERE Steam_ID=?` : `UPDATE User SET Team_ID=? WHERE ID=?`;
					let item2 = data.target ? data.target : data.id;

					db.connectionPool.query(sql,[item],(err,rows2) =>{
						if (rows2.length < 1 || rows2.length > 1){
							responses.returnError(res,"Check your input data.");
						}else if (rows[0].Team_ID === rows2[0].Team_ID ){
							if (data.type === "remove"){
								db.connectionPool.query(sql3,[item3]);
								responses.returnSuccess(res,"Removed user from team.");
							}else if (data.type === "add"){
								responses.returnError(res,"That user is already on your team!");
							}else{
								responses.returnError(res,"Please check your inputs.");
							}
						}else if (rows2[0].Team_ID !== 0){
							if (data.type === "add"){
								responses.returnError(res,"You cannot add someone that is on a team already.");
							}else if (data.type === "remove"){
								responses.returnError(res,"You cannot remove someone that is on a different team.");
							}else{
								responses.returnError(res,"Please check your inputs.");
							}
						}else{
							if (data.type === "add"){
								db.connectionPool.query(sql2,[rows[0].Team_ID,item2]);
								responses.returnSuccess(res,"Added user to team.");
							}else{
								responses.returnError(res,"Please check your inputs.");
							}
						}
					});
				}
			});
		}else{
			responses.returnError(res,"Please check your inputs.");
		}
	}else{
		responses.returnError(res,"Invalid Parameters.");
	}
}

function getSteamID(ID){
	return new Promise((resolve,reject) => {
		if (data.id && !isNaN(parseInt(data.id))){
			db.connectionPool.query(`SELECT Steam_ID FROM User WHERE ID=?`,[ID],(err,rows) => {
				if (rows.length < 1 || rows.length > 1){
					resolve({ succ : false });
				}else{
					resolve({ succ : true, steamID : rows[0].Steam_ID} );
				}
			});
		}
	});
}

module.exports = {
	path: "/manageUser",
	route: (router) => {
		router.use("/", async (req,res) => {
			let data = req.query;
			console.log("Got to alpha");
			if (data.key){
				let steamID;
				if (data.id){
					let obj = await getSteamID(data.id);
					if (obj.succ){
						steamID = obj.steamID;
					}else{
						response.returnError(res,"Please check your inputs.");
					}
				}else{
					steamID = data.target;
				}
				console.log("Got to beta");
				let isValid = await db.authTeamLeader(data.executor, steamID, data.key);
				console.log("Got to charlie");
				if (isValid){
					main(data,req,res);
				}else{
					response.returnError(res,"Please check your inputs.");
				}
			}else{
				responses.returnError(res,"Missing Parameters.");
			}
		});

		return router;
	}
}