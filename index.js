const fs = require("fs");
const Discord = require("discord.js");
const TTSHandler = require("./TTSHandler");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.TTSHandlers = new Discord.Collection();

// Filter js files from commands folder
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

// Set commands exported by each command module
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
// Each command follows the structure:
// {
//   name: "command_name",
//   description: "Command description in plain text.",
//   execute: excute(message, args) {
//     ...command execution logic...
//   }
// }

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	// Initializing handlers for each guild.
	for (const guild of client.guilds.cache.values()) {
		client.TTSHandlers.set(guild.id, new TTSHandler(guild));
	}
});

client.on("message", (message) => {
	if (message.tts) {
		message.reply("disse mecão, tomou um chutão.");
		let TTSAuthor = message.guild.members.cache.get(message.author.id);
		let handler = client.TTSHandlers.get(message.guild.id);

		handler.warn(message);
		handler.kick(message);
		// handler.invite(TTSAuthor);
	} else {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		if (!client.commands.has(command)) return;

		client.commands
			.get(command)
			.execute(message, args)
			.catch((error) => {
				console.error(error);
				message.reply("there was an error trying to execute that command!");
			});
	}
});

client.login(token);
