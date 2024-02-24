const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const connect = require("./config/db-config");

const Group = require("./models/group");
const Chat = require("./models/chat");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
	});

	socket.on("from-client", () => {
		console.log("Received an event from the client");
	});

	socket.on("join-room", (data) => {
		console.log("joining a room", data.roomID);
		socket.join(data.roomID);
	});

	socket.on("new-msg", async (data) => {
		console.log("message received", data);
		await Chat.create({
			content: data.message,
			sender: data.user,
			roomID: data.roomID,
		});
		io.to(data.roomID).emit("msg-rcvd", data);
	});
});

app.get("/chat/:roomid/:user", async (req, res) => {
	const group = await Group.findById(req.params.roomid);
	const chats = await Chat.find({
		roomID: req.params.roomid,
	});
	res.render("index", {
		roomID: req.params.roomid,
		user: req.params.user,
		groupName: group.name,
		previousChats: chats,
	});
});
app.get("/group", (req, res) => {
	res.render("group");
});
app.post("/group", async (req, res) => {
	await Group.create({
		name: req.body.name,
	});
	res.redirect("/group");
});

server.listen(3000, async () => {
	console.log("listening on PORT  :3000");
	await connect();
	console.log("DB connected");
});
