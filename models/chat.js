const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
	content: {
		type: String,
	},
	sender: {
		type: String,
	},
	roomID: {
		type: mongoose.Schema.Types.ObjectId,
	},
});

const chat = mongoose.model('Chat',chatSchema);

module.exports = chat;