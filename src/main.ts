import plugin from '../plugin.json';

const { editor } = editorManager as any;
const fs = acode.require('fs');
const fileList = acode.require('fileList');

let isCompleterAdded = false;

let svelte: any[] = [];

async function loadCompletions(baseUrl: string | undefined): Promise<void> {
	try {
		let content = await fs(baseUrl + 'svelte.json');
		content = await content.readFile('utf-8');
		svelte = JSON.parse(content);
	} catch (e) {
		console.error('[!] Failed to load svelte completions', e);
	}
}

const svelteCompleter = {
	id: 'svelteCompleter',
	getCompletions(
		editor: any,
		session: any,
		pos: any,
		prefix: any,
		callback: any
	) {
		if (!prefix) return callback(null, []);

		callback(null, svelte);
	}
};

async function svelteStatus(): Promise<void> {
	let isSvelteProject = false;
	let isSvelteFile = false;

	try {
		const files = await fileList();
		const active = editorManager.activeFile?.name ?? '';

		isSvelteProject = files.some(
			(file: any) =>
				file.name === 'svelte.config.js' || file.name === 'svelte.config.cjs'
		);
		isSvelteFile = active.endsWith('.svelte');
		const isSvelte = isSvelteProject && isSvelteFile;

		if (!isSvelte && isCompleterAdded) {
			const index = editor.completers.indexOf(svelteCompleter);
			if (index > -1) editor.completers.splice(index, 1);
			isCompleterAdded = false;
			console.log('[+] Svelte Completer Removed');
		}

		if (isSvelte && !isCompleterAdded) {
			editor.completers.push(svelteCompleter);
			isCompleterAdded = true;
			console.log('[+] Svelte Completer Added!');
		}
	} catch (e) {
		console.error('Failed to read project', e);
	}
}

class AcodePlugin {
	public baseUrl: string | undefined;

	async init(
		$page: WCPage,
		cacheFile: any,
		cacheFileUrl: string
	): Promise<void> {
		await loadCompletions(this.baseUrl);
		editorManager.on('switch-file', svelteStatus);
		editorManager.on('file-content-changed', svelteStatus);
		await svelteStatus();
	}

	async destroy() {
		editorManager.off('switch-file', svelteStatus);
		editorManager.off('file-content-changed', svelteStatus);
		const index = editor.completers.indexOf(svelteCompleter);
		if (index > -1) editor.completers.splice(index, 1);
	}
}

if (window.acode) {
	const acodePlugin = new AcodePlugin();
	acode.setPluginInit(
		plugin.id,
		async (
			baseUrl: string,
			$page: WCPage,
			{ cacheFileUrl, cacheFile }: any
		) => {
			if (!baseUrl.endsWith('/')) {
				baseUrl += '/';
			}
			acodePlugin.baseUrl = baseUrl;
			await acodePlugin.init($page, cacheFile, cacheFileUrl);
		}
	);
	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
