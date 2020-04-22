import { GuildEmoji, ReactionEmoji } from "discord.js";

// eslint-disable-next-line
export default class utils {
	static compareIdentifiers(identifier1: string, identifier2: string): boolean {
		return identifier1.split(':').slice(-1)[0] == identifier2.split(':').slice(-1)[0];
	}

	static isEmojiCompatible(key: string | string[], emoji: GuildEmoji | ReactionEmoji): boolean {
		const reactionKeys = [emoji.name, emoji.id, emoji.identifier];

		return typeof key == 'string'
			? reactionKeys.includes(key) || utils.compareIdentifiers(reactionKeys[2], key)
			: key.some(element => utils.isEmojiCompatible(element, emoji));
	}
	
	static formatString(str: string, ...options: any[]): string {
		for (const option of Array.from(options))
			str = str.replace('{}', option);

		return str;
	}
}