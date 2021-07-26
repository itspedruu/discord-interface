export default class Util {
	static filter(userId?): (resolvable) => boolean {
		return (resolvable): boolean => userId 
			? Array.isArray(userId) 
				? userId.includes((resolvable.user ?? resolvable.author).id) 
				: userId == (resolvable.user ?? resolvable.author).id 
			: true;
	}
	
	static formatString(str: string, ...options: any[]): string {
		for (const option of Array.from(options))
			str = str.replace('{}', option);

		return str;
	}
}