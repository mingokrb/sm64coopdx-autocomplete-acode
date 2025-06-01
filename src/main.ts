import plugin from '../plugin.json';
import { SvCache } from './cache';

import svelte from './completers/svelte.json';
import javascript from './completers/javascript.json';
import typescript from './completers/typescript.json';

const editor = editorManager.editor as any;

function loadCompleter(
	pid: string,
	subId: string,
	keywords: {
		value?: string;
		meta?: string;
		caption?: string;
		score?: number;
	}[]
) {
	return {
		id: `${pid}/${subId}`,
		getCompletions: (
			_editor: any,
			_session: any,
			_pos: any,
			prefix: string,
			callback: (err: any, results: any[]) => void
		) => {
			if (!prefix) return callback(null, []);
			const filtered = keywords
				.filter(
					entry => entry.value?.toLowerCase().includes(prefix.toLowerCase())
				)
				.map(entry => ({
					caption: entry.caption || entry.value!,
					value: entry.value!,
					meta: entry.meta || '',
					score: entry.score ?? 100
				}));
			callback(null, filtered);
		}
	};
}

function addCompleter(completer: any, label: string): void {
	if (!editor.completers.includes(completer)) {
		editor.completers.push(completer);
		//console.log(`[/] ${label} completer added`);
	}
}

function removeCompleter(completer: any, label: string): void {
	const index = editor.completers.indexOf(completer);
	if (index !== -1) {
		editor.completers.splice(index, 1);
		//console.log(`[/] ${label} completer removed`);
	}
}

class AcodePlugin {
	public baseUrl: string | undefined;
	private cache = new SvCache();
	private worker?: Worker;

	private completers: Record<string, any> = {};
	private activeCompleters: Set<string> = new Set();

	constructor() {
		this.handleCursorChange = this.handleCursorChange.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	private setCompleter(id: string, completer: any) {
		this.completers[id] = completer;
	}

	private updateCompleters() {
		const { row } = editor.getCursorPosition();
		const script = this.cache.get('script');
		const style = this.cache.get('style');

		const toEnable = new Set<string>();

		// Core Svelte support
		if (editorManager.activeFile.name.endsWith('.svelte')) {
			toEnable.add('svelte');
		}

		// Check if inside <script>
		if (script && row >= script.open && row <= script.close) {
			if (['ts', 'typescript'].includes(script.lang)) {
				toEnable.add('typescript');
				toEnable.add('javascript');
			}
		}

		// Future style handling can go here
		/*
		if (style && row >= style.open && row <= style.close) {
			toEnable.add('css');
			if (['sass', 'scss'].includes(style.lang)) {
				toEnable.add('sass');
			}
		}
		*/

		// Diff sets
		for (const id of this.activeCompleters) {
			if (!toEnable.has(id)) {
				removeCompleter(this.completers[id], id);
				this.activeCompleters.delete(id);
			}
		}

		for (const id of toEnable) {
			if (!this.activeCompleters.has(id)) {
				addCompleter(this.completers[id], id);
				this.activeCompleters.add(id);
			}
		}
	}

	private handleCursorChange() {
		this.updateCompleters();
	}

	private handleWorker() {
		try {
			this.worker?.postMessage(editor.getValue());
		} catch (err) {
			console.error('[PostMessage Error]', err);
		}
	}

	private handleUpdate() {
		this.handleWorker();
		setTimeout(() => this.updateCompleters(), 50);
	}

	async init(
		$page: WCPage,
		_cacheFile: any,
		_cacheFileUrl: string
	): Promise<void> {
		// Init completers
		this.setCompleter('svelte', loadCompleter(plugin.id, 'Svelte', svelte));
		this.setCompleter(
			'javascript',
			loadCompleter(plugin.id, 'JavaScript', javascript)
		);
		this.setCompleter(
			'typescript',
			loadCompleter(plugin.id, 'TypeScript', typescript)
		);
		// Add your css/sass later if needed

		// Start worker
		try {
			this.worker = new Worker(this.baseUrl + 'worker.js');
			this.worker.onmessage = ({ data }) => {
				this.cache.set('script', data.script);
				this.cache.set('style', data.style);
				this.updateCompleters();
			};
		} catch (e) {
			console.error('[Plugin] Failed to load worker:', e);
		}

		await this.handleWorker();

		editorManager.on('switch-file', this.handleUpdate);
		editorManager.on('file-content-changed', this.handleUpdate);
		editor.selection.on('changeCursor', this.handleCursorChange);
	}

	async destroy() {
		editorManager.off('switch-file', this.handleUpdate);
		editorManager.off('file-content-changed', this.handleUpdate);
		editor.selection?.off('changeCursor', this.handleCursorChange);

		this.worker?.terminate();
		this.worker = undefined;

		// Cleanup completers
		for (const id of this.activeCompleters) {
			removeCompleter(this.completers[id], id);
		}
		this.activeCompleters.clear();
		this.cache.clear();
	}
}

// Lifecycle hook
if (window.acode) {
	const acodePlugin = new AcodePlugin();

	acode.setPluginInit(
		plugin.id,
		async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
			acodePlugin.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
			await acodePlugin.init($page, cacheFile, cacheFileUrl);
		}
	);

	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
