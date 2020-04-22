const TWO_MINUTES_MS = 120000;

const DEFAULT_COMMON_OPTIONS = {
	time: TWO_MINUTES_MS,
	embedColor: 'RANDOM',
	deleteMessage: true
}

const DEFAULT_CONFIRMATION_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	reactions: {
		accept: '✅',
		decline: '❎'
	}
}

const DEFAULT_RESPONSE_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	returnInt: false,
	returnContent: true,
	cancelMessage: 'cancel'
}

const DEFAULT_PAGINATION_OPTIONS = {
	...DEFAULT_COMMON_OPTIONS,
	deleteReaction: true,
	goToPageText: `Type a page number between **1** and **{}** or type **cancel** to cancel the action`,
	reactions: {
		goToStart: '⏪',
		previousPage: '◀',
		nextPage: '▶',
		goToEnd: '⏩',
		goToPage: '🔍',
		cancel: '🚫'
	}	
}

export {
	DEFAULT_CONFIRMATION_OPTIONS,
	DEFAULT_RESPONSE_OPTIONS,
	DEFAULT_PAGINATION_OPTIONS
}