import {
	TextChannel, 
	DMChannel, 
	MessageButton, 
	NewsChannel, 
	MessageActionRow, 
	InteractionReplyOptions, 
	CommandInteraction, 
	ButtonInteraction,
	SelectMenuInteraction,
	Message
} from 'discord.js';

export type InteractionResolvable = CommandInteraction | ButtonInteraction | SelectMenuInteraction;

export interface CommonOptions {
	time?: number;
	embedColor?: string;
	deleteMessage?: boolean;
	deleteButtons?: boolean;
	userId?: string;
	channel?: TextChannel | DMChannel | NewsChannel;
	interaction?: InteractionResolvable;
}

/*
CONFIRMATION
*/
export interface ConfirmationOptions extends CommonOptions {
	messageOptions: InteractionReplyOptions;
	component?: MessageActionRow;
}

export interface ConfirmationResult {
	hasConfirmed: boolean;
	interaction: ButtonInteraction;
}

/*
RESPONSE
*/
export interface ResponseOptions extends CommonOptions {
	messageOptions: InteractionReplyOptions;
	parseAsInteger?: boolean;
	cancelMessageOptions?: InteractionReplyOptions;
	cancelComponent?: MessageActionRow;
	min?: number;
	max?: number;
	deleteCollectedMessage?: boolean;
}

export interface ResponseResult {
	parsed: string | number;
	collected: Message;
}

/*
PAGINATION
*/
export interface PaginationOptions extends CommonOptions {
	items: any[];
	buttons?: PaginationButtons;
	extraComponents?: MessageActionRow[];
	searchMessageOptions?: InteractionReplyOptions;
	getPageMessageOptions(item: any, pageNumber: number): InteractionReplyOptions | Promise<InteractionReplyOptions>;
}

export interface PaginationButtons {
	goToStart: MessageButton;
	previousPage: MessageButton;
	nextPage: MessageButton;
	goToEnd: MessageButton;
	search: MessageButton;
	close: MessageButton;
}