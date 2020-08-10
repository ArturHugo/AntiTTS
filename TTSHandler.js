const ytdl = require("ytdl-core");

module.exports = class TTSHandler {
	constructor(guild) {
		this.guild = guild;
	}

	warn(message) {
		const voiceChannel = message.member.voice.channel;
		voiceChannel
			.join()
			.then((connection) => {
				console.log("Joined channel!");
				// Play the warning audio after joining the channel.
				const stream = ytdl("https://www.youtube.com/watch?v=cO8VfSBMU8Y", {
					filter: "audioonly",
				});
				const dispatcher = connection.play(stream);
				dispatcher.on("finish", () => {
					console.log("Left channel!");
					voiceChannel.leave();
				});
			})
			.catch((error) => console.log(error));
	}

	kick(message) {
		message.guild.members.cache
			.get(message.author.id)
			.kick("vc disse mecão")
			.catch((error) => {
				console.log(error);
				message.reply("I do not have permission to kick you.");
			});
	}
	// kick(TTSAuthor) {
	//   TTSAuthor.kick("vc disse mecão")
	//   .catch((error) => {
	//     console.log(error);
	//     message.reply("I do not have permission to kick you.");
	//   });
	// }
};
