module.exports = {
	loopRows: (rows, type) => {
		if (rows.length < 1){
			obj = `No ${type} found.`;
		}else{
			obj = {};
			for (let i = 0; i < rows.length; i++){
				obj[`${rows[i].Name}`] = rows[i].Display_Name;
			}
		}
		return obj;
	},
}