import { ConfirmationOptions } from '../utils/interfaces';
import { TextChannel, DMChannel, MessageEmbed, NewsChannel } from 'discord.js';
import utils from '../utils';
import { EventEmitter } from 'events';
import { DEFAULT_CONFIRMATION_OPTIONS } from '../utils/defaults';

export default class Confirmation extends EventEmitter {
	options: ConfirmationOptions;
	channel: TextChannel | DMChannel | NewsChannel;

	constructor(options: ConfirmationOptions) {
		super();

		// @ts-ignore
		this.options = {...DEFAULT_CONFIRMATION_OPTIONS, ...options}
		this.channel = options.channel;

		this.run();
	}

	async run(): Promise<void> {
		const message = await this.channel.send(new MessageEmbed()
			.setDescription(this.options.text)
			.setColor(this.options.embedColor)
			.setTimestamp()
		);

		const reactions = Object.values(this.options.reactions);
		const filter = (reaction, user): boolean => utils.isEmojiCompatible(reactions, reaction.emoji) && this.options.userId == user.id;
		const collector = message.createReactionCollector(filter, {max: 1, ...this.options});

		collector.on('collect', reaction => {
			const hasConfirmed = utils.isEmojiCompatible(reactions[0], reaction.emoji);

			this.emit('confirmation', hasConfirmed);
		});

		collector.on('end', (_, reason) => {
			if (this.options.deleteMessage)
				message.delete();

			this.emit('over', reason == 'time');
		});

		for (const reaction of reactions)
			await message.react(reaction);
	}

	static create(options: ConfirmationOptions): Confirmation {
		return new Confirmation(options);
	}
}