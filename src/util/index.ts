export default class Util {
	static filter(userId?): (resolvable) => boolean {
		return (resolvable): boolean => {
			if (!userId) {
				return true;
			}

			const executorId = resolvable.user?.id ?? resolvable.author?.id;

			return (Array.isArray(userId) && userId.includes(executorId)) || userId === executorId;
		}
	}
	
	static formatString(str: string, ...options: any[]): string {
		for (const option of Array.from(options))
			str = str.replace('{}', option);

		return str;
	}
}