const ytdl = require("ytdl-core");

module.exports = {
	name: "kickTTSAuthorPipeline",
	description:
		"Pipeline to handle TTS messages (reply -> play warning -> send invite -> kick author)",
	execute(message, pipelineOptions) {
		startPipeline(message, pipelineOptions, playWarning);
	},
};

function startPipeline(message, pipelineOptions, func) {
	message
		.reply(pipelineOptions.initialReplyMessage)
		.then(() => {
			func(message, pipelineOptions, inviteMember);
		})
		.catch((error) => {
			console.log(error);
			pipelineAbortLog(func);
		});
}

function playWarning(message, pipelineOptions, func) {
	const voiceChannel = message.member.voice.channel;
	if (voiceChannel) {
		voiceChannel
			.join()
			.then((connection) => {
				console.log("Joined channel!");
				// Play the warning audio after joining the channel.
				const stream = ytdl(pipelineOptions.audioWarningURL, {
					filter: "audioonly",
				});
				const dispatcher = connection.play(stream);
				dispatcher.on("finish", () => {
					console.log("Left channel!");
					voiceChannel.leave();
				});
			})
			.then(() => {
				func(message, pipelineOptions, kickMember);
			})
			.catch((error) => {
				console.log(error);
				pipelineAbortLog(func);
			});
	}
}

function inviteMember(message, pipelineOptions, func) {
	message.channel
		.createInvite({ unique: true, temporary: false })
		.then((invite) => {
			message.member.send("https://discord.gg/" + invite).then(() => {
				func(message, pipelineOptions, noOperation);
			});
		})
		.catch((error) => {
			console.log(error);
			pipelineAbortLog(func);
		});
}

function kickMember(message, pipelineOptions, func) {
	message.member
		.kick(pipelineOptions.kickReasonMessage)
		.then(() => {
			noOperation(null);
		})
		.catch((error) => {
			console.log(error);
			message.reply(pipelineOptions.kickFailedMessage);
			pipelineAbortLog(func);
		});
}

function noOperation(func) {
	return;
}

function pipelineAbortLog(func) {
	console.log("Pipeline aborted right before", func.name, "step.");
	console.log(func);
}
