import { TextChannel, DMChannel, NewsChannel, InteractionReplyOptions, MessageActionRow, Message, ButtonInteraction } from 'discord.js';
import { EventEmitter } from 'events';
import Response from './Response';

import util from '../util';

import { PaginationOptions, InteractionResolvable } from '../util/Interfaces';
import { DEFAULT_PAGINATION_OPTIONS } from '../util/Defaults';

export default class Pagination extends EventEmitter {
	options: PaginationOptions;
	index: number;
	channel?: TextChannel | DMChannel | NewsChannel;
	interaction?: InteractionResolvable;

	constructor(options: PaginationOptions) {
		super();

		this.options = {...DEFAULT_PAGINATION_OPTIONS, ...options};
		this.index = 0;

		this.channel = options.channel;
		this.interaction = options.interaction;

		this.run();
	}

	getComponents(): MessageActionRow[] {
		const closeRow = new MessageActionRow().addComponents(this.options.buttons.close);
		const extraComponents = this.options.extraComponents ?? [];

		if (this.options.items.length === 1) {
			return [...extraComponents, closeRow];
		}

		if (this.options.items.length === 2) {
			const firstRow = new MessageActionRow().addComponents(
				this.options.buttons.previousPage,
				this.options.buttons.nextPage,
				this.options.buttons.close
			);

			return [firstRow, ...extraComponents];
		}

		const firstRow = new MessageActionRow().addComponents(
			this.options.buttons.goToStart,
			this.options.buttons.previousPage,
			this.options.buttons.nextPage,
			this.options.buttons.goToEnd,
			this.options.buttons.search
		);

		return [firstRow, ...extraComponents, closeRow]
	}

	async getPageMessageOptions(deleteButtons?: boolean): Promise<InteractionReplyOptions> {
		const options = await (this.options.getPageMessageOptions(this.options.items[this.index], this.index + 1) as Promise<InteractionReplyOptions>);

		if (!options) {
			return;
		}

		const components = this.getComponents();

		if (options.ephemeral) {
			options.ephemeral = false;
		}

		if (!deleteButtons) {
			options.components = components;
		}

		return options;
	}

	async run(): Promise<void> {
		const options = await this.getPageMessageOptions();

		if (!options) {
			return;
		}

		if (this.interaction) {
			try {
				await this.interaction.reply(options);
			} catch (e) {
				return console.error(e);
			}
		}

		const message = this.interaction
			? await this.interaction.fetchReply() as Message
			: await this.channel.send(options) as Message;

		const filter = util.filter(this.options.userId);
		const collector = message.createMessageComponentCollector({filter, ...this.options});

		collector.on('collect', async (interaction: ButtonInteraction) => {
			let pageNumber: number;

			switch (interaction.customId) {
				case 'DI_CLOSE':
					collector.stop();
					break;
				case 'DI_GO_TO_START':
					this.index = 0;
					break;
				case 'DI_PREVIOUS_PAGE':
					this.index = this.index - 1 < 0 ? this.options.items.length - 1 : this.index - 1;
					break;
				case 'DI_NEXT_PAGE':
					this.index = (this.index + 1) % this.options.items.length;
					break;
				case 'DI_GO_TO_END':
					this.index = this.options.items.length - 1;
					break;
				case 'DI_SEARCH':
					pageNumber = await this.getResponse(interaction);

					if (!pageNumber) {
						return;
					}

					this.index = pageNumber - 1;

					break;
				default:
					this.emit('extraInteraction', interaction);
			}

			const options = await this.getPageMessageOptions();

			if (!options) {
				return;
			}

			if (message.editable) {
				await message.edit(options).catch(console.error);
			}

			if (interaction.customId !== 'DI_SEARCH') {
				await interaction.deferUpdate();
			}
		});

		collector.on('end', async (_, reason) => {
			if (this.options.deleteMessage) {
				if (message.deletable) {
					message.delete();
				}
			} else if (this.options.deleteButtons) {
				const options = await this.getPageMessageOptions(true);

				if (!options) {
					return;
				}

				message.edit(options);
			}

			this.emit('over', reason == 'time');
		});
	}

	async getResponse(interaction: ButtonInteraction): Promise<number> {
		const response = await Response.get({
			messageOptions: this.options.searchMessageOptions,
			parseAsInteger: true,
			min: 1,
			max: this.options.items.length,
			...this.options,
			interaction,
			deleteMessage: true,
			deleteCollectedMessage: true
		});

		if (!response) {
			return;
		}

		return response.parsed as number;
	}

	static create(options: PaginationOptions): Pagination {
		return new Pagination(options);
	}
}