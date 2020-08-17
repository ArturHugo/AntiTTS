const fs = require("fs");
const Discord = require("discord.js");
const kickTTSAuthorPipeline = require("./kickTTSAuthorPipeline");
const { prefix, token } = require("../config.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.TTSHandlers = new Discord.Collection();

// Filter js files from commands folder
const commandFiles = fs
	.readdirSync("src/commands")
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
//   excute(message, args) {
//     ...command execution logic...
//   }
// }

// Defining default options for the pipeline
const defaultPipelineOptions = {
	initialReplyMessage: "disse mecão, tomou um chutão!",
	audioWarningURL: "https://www.youtube.com/watch?v=cO8VfSBMU8Y",
	kickReasonMessage: "disse mecão, tomou um chutão.",
	kickFailedMessage: "I do not have permission to kick you.",
};

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	if (message.tts) {
		kickTTSAuthorPipeline.execute(message, defaultPipelineOptions);
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
