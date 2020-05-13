import { ResponseOptions } from '../utils/interfaces';
import { TextChannel, DMChannel, MessageEmbed, Message, NewsChannel } from 'discord.js';
import { EventEmitter } from 'events';
import { DEFAULT_RESPONSE_OPTIONS } from '../utils/defaults';

type ParsedResponse = Message | string | number | null;

export default class Response extends EventEmitter {
	options: ResponseOptions;
	channel: TextChannel | DMChannel | NewsChannel;

	constructor(options: ResponseOptions) {
		super();

		this.options = {...DEFAULT_RESPONSE_OPTIONS, ...options};
		this.channel = options.channel;

		this.run();
	}

	async run(): Promise<void> {
		const message = await this.channel.send(new MessageEmbed()
			.setDescription(this.options.text)
			.setColor(this.options.embedColor)
			.setTimestamp()
		);

		const filter = (collectedMessage): boolean => this.options.userId == collectedMessage.author.id;
		const collector = this.channel.createMessageCollector(filter, {max: 1, ...this.options});

		collector.on('collect', message => {
			this.emit('response', message);

			this.emit('collected', this.handleMessage(message));

			if (this.options.deleteMessage)
				message.delete();
		});

		collector.on('end', (_, reason) => {
			if (this.options.deleteMessage)
				message.delete();

			this.emit('over', reason == 'time');
		});
	}

	handleMessage(message): ParsedResponse {
		if (this.options.cancelMessage.toLowerCase() == message.content.toLowerCase())
			return null;

		if (this.options.returnContent === false)
			return message;

		if (this.options.returnInt) {
			const quantity = parseInt(message.content);

			if (this.options.min && this.options.max && (quantity < this.options.min || quantity > this.options.max))
				return null;

			return quantity;
		}

		return message.content;
	}

	static create(options: ResponseOptions): Response {
		return new Response(options);
	}
}