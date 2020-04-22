import { PaginationOptions } from '../utils/interfaces';
import { TextChannel, DMChannel } from 'discord.js';
import utils from '../utils';
import { EventEmitter } from 'events';
import Response from './Response';
import { DEFAULT_PAGINATION_OPTIONS } from '../utils/defaults';

export default class Pagination extends EventEmitter {
	options: PaginationOptions;
	channel: TextChannel | DMChannel;
	index: number;

	constructor(options: PaginationOptions) {
		super();

		this.options = {...DEFAULT_PAGINATION_OPTIONS, ...options};
		this.channel = options.channel;
		this.index = 0;

		this.run();
	}

	async run(): Promise<void> {
		const message = await this.channel.send(await this.options.getPage(this.options.items[this.index], this.index + 1));

		const reactions = this.options.items.length == 1
			? [...this.options.extraReactions, this.options.reactions.cancel]
			: this.options.items.length == 2
				? [
					this.options.reactions.previousPage, 
					...this.options.extraReactions, 
					this.options.reactions.nextPage, 
					this.options.reactions.cancel
				]
				: [
					this.options.reactions.goToStart,
					this.options.reactions.previousPage, 
					...this.options.extraReactions, 
					this.options.reactions.nextPage,
					this.options.reactions.goToEnd,
					this.options.reactions.goToPage,
					this.options.reactions.cancel
				];
		const filter = (reaction, user): boolean => utils.isEmojiCompatible(reactions, reaction.emoji) && this.options.userId == user.id;
		const collector = message.createReactionCollector(filter, this.options);

		collector.on('collect', async reaction => {
			const actions: any = {};

			for (const key of Object.keys(this.options.reactions)) 
				actions[key] = utils.isEmojiCompatible([this.options.reactions[key]], reaction.emoji);

			if (actions.cancel)
				return collector.stop();

			if (this.options.extraReactions)
				actions.extraReaction = utils.isEmojiCompatible(this.options.extraReactions, reaction.emoji);

			if (actions.goToStart)
				this.index = 0;
			
			if (actions.previousPage)
				this.index = this.index - 1 < 0 ? this.options.items.length - 1 : this.index - 1;
			
			if (actions.nextPage)
				this.index = (this.index + 1) % this.options.items.length;
			
			if (actions.goToEn)
				this.index = this.options.items.length - 1;
			
			if (actions.goToPage) {
				const pageNumber = await this.getResponse();
				if (!pageNumber) return;

				this.index = pageNumber - 1;
			}

			if (actions.extraReaction)
				this.emit('extraReaction', reaction);

			if (this.options.deleteReaction)
				await reaction.users.remove(this.options.userId);

			await message.edit(await this.options.getPage(this.options.items[this.index], this.index + 1));
		});

		collector.on('end', (_, reason) => {
			if (this.options.deleteMessage)
				message.delete();

			this.emit('over', reason == 'time');
		});

		for (const reaction of reactions)
			await message.react(reaction);
	}

	async getResponse(): Promise<number | null> {
		const response = Response.create({
			text: utils.formatString(this.options.goToPageText, this.options.items.length),
			returnInt: true,
			min: 1,
			max: this.options.items.length,
			...this.options
		});

		return new Promise(resolve => {
			response.on('collected', resolve);
			
			response.on('over', hasTimeEnded => hasTimeEnded ? resolve(null) : null);
		});
	}

	static create(options: PaginationOptions): Pagination {
		return new Pagination(options);
	}
}