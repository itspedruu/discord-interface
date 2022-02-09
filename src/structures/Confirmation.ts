import { TextChannel, DMChannel, NewsChannel, Message, ButtonInteraction } from 'discord.js';

import { ConfirmationOptions, ConfirmationResult, InteractionResolvable } from '../util/Interfaces';
import { DEFAULT_CONFIRMATION_OPTIONS } from '../util/Defaults';

export default class Confirmation {
	options: ConfirmationOptions;
	channel?: TextChannel | DMChannel | NewsChannel;
	interaction?: InteractionResolvable;

	constructor(options: ConfirmationOptions) {
		this.options = {...DEFAULT_CONFIRMATION_OPTIONS, ...options};

		this.channel = options.channel;
		this.interaction = options.interaction;
	}

	async run(): Promise<ConfirmationResult> {
		if (!this.options.messageOptions.components) {
			this.options.messageOptions.components = [this.options.component];
		}

		if (this.options.messageOptions.ephemeral) {
			this.options.messageOptions.ephemeral = false;
		}

		const message = (this.interaction ? await this.interaction.fetchReply() : await this.channel.send(this.options.messageOptions)) as Message;
		const filter = (interaction): boolean => this.options.userId ? interaction.user.id === this.options.userId : true;
		const collector = message.createMessageComponentCollector({filter, max: 1, ...this.options});

		return new Promise(resolve => {
			collector.on('collect', (interaction: ButtonInteraction) => {
				interaction.deferUpdate();

				const hasConfirmed = interaction.customId === 'DI_YES';
	
				resolve({hasConfirmed, interaction});
			});
	
			collector.on('end', (_, reason) => {
				if (this.options.deleteMessage) {
					message.delete();
				} else if (this.options.deleteButtons) {
					delete this.options.messageOptions.components;

					message.edit(this.options.messageOptions);
				}
	
				if (reason === 'time') {
					resolve(null);
				}
			});
		});
	}

	static get(options: ConfirmationOptions): Promise<ConfirmationResult> {
		const confirmation = new Confirmation(options);

		return confirmation.run();
	}
}