export class SvCache {
	private cache = new Map<string, any>();

	get<T = any>(key: string): T | undefined {
		return this.cache.get(key);
	}

	set<T = any>(key: string, value: T): void {
		this.cache.set(key, value);
	}

	clear(): void {
		this.cache.clear();
	}

	has(key: string): boolean {
		return this.cache.has(key);
	}
}