const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	isPersonal: {
		type: Boolean,
      default: false,
	},
});

const group = mongoose.model("Group", groupSchema);

module.exports = group;
