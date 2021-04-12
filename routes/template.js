module.exports = {
	path: "/test",
	route: (router) => {
		router
			.get("/", (req,res) => res.send("GET TEST"));
		return router;
	},
};