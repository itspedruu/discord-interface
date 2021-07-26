import {
	TextChannel, 
	DMChannel, 
	MessageButton, 
	NewsChannel, 
	MessageActionRow, 
	InteractionReplyOptions, 
	CommandInteraction, 
	ButtonInteraction,
	Message
} from 'discord.js';

export interface CommonOptions {
	time?: number;
	embedColor?: string;
	deleteMessage?: boolean;
	deleteButtons?: boolean;
	userId?: string;
	channel?: TextChannel | DMChannel | NewsChannel;
	interaction?: CommandInteraction;
	messageOptions: InteractionReplyOptions;
}

export interface ConfirmationOptions extends CommonOptions {
	component?: MessageActionRow;
}

export interface ConfirmationResult {
	hasConfirmed: boolean;
	interaction: ButtonInteraction;
}

export interface ResponseOptions extends CommonOptions {
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

export interface PaginationOptions extends CommonOptions {
	items: any[];
	buttons?: PaginationButtons;
	extraComponents?: MessageActionRow[];
	searchMessageOptions?: InteractionReplyOptions;
	getPageMessageOptions(item: any, pageNumber: number): InteractionReplyOptions;
}

export interface PaginationButtons {
	goToStart: MessageButton;
	previousPage: MessageButton;
	nextPage: MessageButton;
	goToEnd: MessageButton;
	search: MessageButton;
	close: MessageButton;
}