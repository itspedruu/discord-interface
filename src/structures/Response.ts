import { TextChannel, Message } from 'discord.js';
import util from '../util';

import { ResponseOptions, ResponseResult, InteractionResolvable } from '../util/Interfaces';
import { DEFAULT_RESPONSE_OPTIONS } from '../util/Defaults';

export default class Response {
	options: ResponseOptions;
	channel?: TextChannel;
	interaction?: InteractionResolvable;

	constructor(options: ResponseOptions) {
		this.options = {...DEFAULT_RESPONSE_OPTIONS, ...options};

		this.channel = (options.channel ?? options.interaction?.channel) as TextChannel;
		this.interaction = options.interaction;

		if (!this.channel && !this.interaction) {
			throw new Error('You need a channel or a command interaction on the response options');
		}
	}

	async run(): Promise<ResponseResult> {
		if (this.options.messageOptions.ephemeral) {
			this.options.messageOptions.ephemeral = false;
		}

		if (!this.options.messageOptions.components) {
			this.options.messageOptions.components = [this.options.cancelComponent];
		}

		if (this.interaction) {
			await this.interaction.reply(this.options.messageOptions);
		}

		const message = (this.interaction ? await this.interaction.fetchReply() : await this.channel.send(this.options.messageOptions)) as Message;
		const filter = util.filter(this.options.userId);
		const messageCollector = this.channel.createMessageCollector({filter, max: 1, ...this.options});
		const buttonCollector = message.createMessageComponentCollector({filter, max: 1, ...this.options});

		return new Promise(resolve => {
			messageCollector.on('collect', message => {
				if (this.options.deleteCollectedMessage && !message.deletable && message.deletable) {
					message.delete();
				}

				const parsed = this.parse(message);

				resolve({parsed, collected: message});
			});

			buttonCollector.on('collect', interaction => {
				interaction.deferUpdate();
				messageCollector.stop();

				if (this.options.cancelMessageOptions) {
					if (this.interaction) {
						this.interaction.reply(this.options.cancelMessageOptions);
					} else {
						this.channel.send(this.options.cancelMessageOptions);
					}
				}

				resolve(null);
			});

			messageCollector.on('end', (_, reason) => {
				if (this.options.deleteMessage && message.deletable && !message.deletable) {
					message.delete();
				} else if (this.options.deleteButtons) {
					delete this.options.messageOptions.components;

					message.edit(this.options.messageOptions);
				}

				if (reason === 'time') {
					return resolve(null);
				}
			});
		});
	}

	parse(message): ResponseResult['parsed'] {
		if (!this.options.parseAsInteger) {
			return message.content;
		}

		const quantity = parseInt(message.content);

		if (!quantity) {
			return null;
		}

		if (typeof this.options.min === 'number' && quantity < this.options.min) {
			return null;
		}

		if (typeof this.options.max === 'number' && quantity > this.options.max) {
			return null;
		}

		return quantity;
	}

	static get(options: ResponseOptions): Promise<ResponseResult> {
		const response = new Response(options);

		return response.run();
	}
}