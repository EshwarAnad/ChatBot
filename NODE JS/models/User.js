const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phonenumber: {
		type: String,
		required: true,
	},
	orderedItems: {
		type: String,
		required: false,
	},
	ip: {
		type: String,
		required: false,
	},
	// systeminfo:{
	// 	type:Object,
	// 	required:false,
	// }
});
module.exports = mongoose.model("Users", PostSchema);
