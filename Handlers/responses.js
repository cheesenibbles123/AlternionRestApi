module.exports = {
	returnError: (res,content) => {
		res.send({
			isSuccess : false,
			content : content
		});
	},
	returnSuccess: (res,content) => {
		res.send({
			isSuccess : true,
			content : content
		});
	},
}