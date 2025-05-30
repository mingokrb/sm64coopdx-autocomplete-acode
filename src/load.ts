import plugin from '../plugin.json';

const fs = acode.require('fs');
const pid = plugin.id;

async function loadCompleter(
	path: string | undefined,
	subId: string
): Promise<object | undefined> {
	try {
		const fsc = await fs(`${path}/${subId}.json`);
		const content = await fsc.readFile('utf-8');
		const json = JSON.parse(content);
		return {
			id: `${pid}/${subId}`,
			getCompletions: async (
				editor: any,
				session: any,
				pos: any,
				prefix: any,
				callback: any
			) => {
				if (!prefix) return callback(null, []);
				callback(null, json);
			}
		};
	} catch (e) {
		console.error(`[!] Failed to load ${subId} completer!`, e);
		return;
	}
}

export async function loadSvelte(path: string | undefined) {
	return loadCompleter(path, 'svelte');
}

export async function loadTs(path: string | undefined) {
	return loadCompleter(path, 'typescript');
}

export async function loadJs(path: string | undefined) {
	return loadCompleter(path, 'javascript');
}

// future installment
export async function loadScss(path: string | undefined) {
	return loadCompleter(path, 'sass');
}
