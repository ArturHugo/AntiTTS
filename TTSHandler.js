module.exports = class TTSHandler {
	constructor(guild) {
		this.guild = guild;
	}

	// warn(TTSAuthor) {
	//   TTSAuthor.kick("vc disse mecão")
	//   .catch((error) => {
	//     console.log(error);
	//     message.reply("I do not have permission to kick you.");
	//   });
	// }

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
