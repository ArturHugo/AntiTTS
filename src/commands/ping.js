module.exports = {
	name: "Ping",
	description: "Replies pong!",
	execute(message, args) {
		message.reply("Pong!");
	},
};
