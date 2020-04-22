import {TextChannel, DMChannel, MessageEmbed} from 'discord.js';

export interface CommonOptions {
	time?: number;
	userId: string;
	embedColor?: string;
	channel: TextChannel | DMChannel;
	deleteMessage?: boolean;
}

export interface ConfirmationOptions extends CommonOptions {
	reactions?: ConfirmationReactionOptions;
	text: string;
}

export interface ConfirmationReactionOptions {
	accept: string;
	decline: string;
}

export interface ResponseOptions extends CommonOptions {
	text: string;
	returnInt?: boolean;
	returnContent?: boolean;
	cancelMessage?: string;
	min?: number;
	max?: number;
}

export interface PaginationOptions extends CommonOptions {
	items: any[];
	reactions?: PaginationReactionOptions;
	deleteReaction?: boolean;
	extraReactions?: string[];
	goToPageText?: string;
	getPage(item: any, pageNumber: number): MessageEmbed;
}

export interface PaginationReactionOptions {
	goToStart: string;
	previousPage: string;
	nextPage: string;
	goToEnd: string;
	goToPage: string;
	cancel: string;
}