import { MessageActionRow, MessageButton } from 'discord.js';

const TWO_MINUTES_MS = 120000;

/*
COMMON OPTIONS
*/
const DEFAULT_COMMON_OPTIONS = {
	time: TWO_MINUTES_MS,
	embedColor: 'RANDOM',
	deleteMessage: true
}

/*
CONFIRMATION
*/
const DEFAULT_CONFIRMATION_COMPONENT = new MessageActionRow().addComponents(
	new MessageButton().setLabel('Yes').setCustomId('DI_YES').setStyle('SUCCESS'),
	new MessageButton().setLabel('No').setCustomId('DI_NO').setStyle('DANGER')
);

const DEFAULT_CONFIRMATION_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	component: DEFAULT_CONFIRMATION_COMPONENT
}

/*
RESPONSE
*/
const DEFAULT_CANCEL_COMPONENT = new MessageActionRow().addComponents(new MessageButton().setLabel('Cancel').setCustomId('DI_CANCEL').setStyle('DANGER'))

const DEFAULT_RESPONSE_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	parseAsInteger: false,
	cancelMessageOptions: {content: 'Action canceled.'},
	cancelComponent: DEFAULT_CANCEL_COMPONENT
}

/*
PAGINATION
*/
const DEFAULT_PAGINATION_BUTTONS = {
	goToStart: new MessageButton().setCustomId('DI_GO_TO_START').setEmoji('⏪').setStyle('SECONDARY'),
	previousPage: new MessageButton().setCustomId('DI_PREVIOUS_PAGE').setLabel('◀').setStyle('SECONDARY'),
	nextPage: new MessageButton().setCustomId('DI_NEXT_PAGE').setLabel('▶').setStyle('SECONDARY'),
	goToEnd: new MessageButton().setCustomId('DI_GO_TO_END').setLabel('⏩').setStyle('SECONDARY'),
	search: new MessageButton().setCustomId('DI_SEARCH').setEmoji('🔍').setLabel('Search').setStyle('SECONDARY'),
	close: new MessageButton().setCustomId('DI_CLOSE').setLabel('Close').setStyle('DANGER')
}

const DEFAULT_PAGINATION_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	buttons: DEFAULT_PAGINATION_BUTTONS,
	searchMessageOptions: {content: 'Type a page number:'}
}

export {
	DEFAULT_CONFIRMATION_OPTIONS,
	DEFAULT_RESPONSE_OPTIONS,
	DEFAULT_PAGINATION_OPTIONS
}