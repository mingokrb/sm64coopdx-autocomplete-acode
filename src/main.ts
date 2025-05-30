import plugin from '../plugin.json';
import { loadSvelte, loadTs, loadJs } from './load';

const editor = editorManager.editor as any;

class AcodePlugin {
	public baseUrl: string | undefined;
	svelte?: any;
	typescript?: any;
	javascript?: any;
	sass?: any;
	debounceTimer?: number;

	constructor() {
		this.initAutocomplete = this.initAutocomplete.bind(this);
		this.debouncedInitAutocomplete = this.debouncedInitAutocomplete.bind(this);
	}

	async isSvelte(): Promise<boolean> {
		try {
			const active = editorManager.activeFile?.name;
			return active.endsWith('.svelte') ?? false;
		} catch (e) {
			console.error('Failed to load check files: ', e);
			return false;
		}
	}

	checkTs(): boolean {
		const content = editor.getValue();
		return /lang\s*=\s*["'](ts|typescript)["']/g.test(content);
	}

	addCompleter(completer: any, label: string): void {
		if (!editor.completers.includes(completer)) {
			try {
				editor.completers.push(completer);
				console.log(`[/] ${label} Completer Added`);
			} catch (e) {
				console.log(`[*] Unable to add ${label} Completer`, e);
			}
		}
	}

	removeCompleter(completer: any, label: string) {
		if (!editor.completers.includes(completer)) return;
		const index = editor.completers.indexOf(completer);
		if (index > -1) editor.completers.splice(index, 1);
		console.log(`[/] Removed ${label} Svelte Autocompleter`);
	}

	async initAutocomplete(): Promise<void> {
		const isSvelte = await this.isSvelte();
		const isTs = this.checkTs();

		if (!isSvelte) {
			this.removeCompleter(this.svelte, 'Svelte');
			this.removeCompleter(this.javascript, 'Javascript');
		}
		if (!isTs) this.removeCompleter(this.typescript, 'Typescript');

		if (isSvelte) {
			this.addCompleter(this.svelte, 'Svelte');
			this.addCompleter(this.javascript, 'Javascript');
		}
		if (isTs) this.addCompleter(this.typescript, 'Typescript');
	}

	debouncedInitAutocomplete() {
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		this.debounceTimer = setTimeout(() => this.initAutocomplete(), 200);
	}

	async init(
		$page: WCPage,
		_cacheFile: any,
		_cacheFileUrl: string
	): Promise<void> {
		this.svelte = await loadSvelte(this.baseUrl);
		this.typescript = await loadTs(this.baseUrl);
		this.javascript = await loadJs(this.baseUrl);

		await this.initAutocomplete();

		editorManager.on('switch-file', this.debouncedInitAutocomplete);
		editorManager.on('file-content-changed', this.debouncedInitAutocomplete);
	}

	async destroy() {
		editorManager.off('switch-file', this.debouncedInitAutocomplete);
		editorManager.off('file-content-changed', this.debouncedInitAutocomplete);
		this.removeCompleter(this.svelte, 'Svelte');
		this.removeCompleter(this.typescript, 'Typescript');
		this.removeCompleter(this.javascript, 'Javascript');
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
			acodePlugin.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
			await acodePlugin.init($page, cacheFile, cacheFileUrl);
		}
	);
	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
