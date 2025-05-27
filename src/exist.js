const fs = require('fs');
const path = require('path');

const completions = [];

function addCompletion(
	caption,
	value = caption,
	meta = 'svelte',
	score = 1000
) {
	completions.push({ caption, value, meta, score });
}

// Stage 1: Core Svelte completions
const svelteCore = [
	'on:click',
	'on:submit',
	'bind:value',
	'bind:group',
	'bind:checked',
	'bind:this',
	'slot',
	'slot:name',
	'transition:fade',
	'transition:fly',
	'transition:slide',
	'in:fade',
	'out:fade',
	'animate:flip',
	'class:active',
	'let:props',
	'#if',
	'#each',
	'#await',
	'svelte:head',
	'svelte:options',
	'svelte:window',
	'svelte:body',
	'svelte:fragment',
	'svelte:element'
];

svelteCore.forEach(item => addCompletion(item, item, 'svelte-core'));

// Stage 2: TypeScript in Svelte
const tsTypes = [
	'string',
	'number',
	'boolean',
	'any',
	'unknown',
	'void',
	'Array<T>',
	'Record<K, V>',
	'Writable<T>',
	'Readable<T>',
	'interface',
	'type',
	'implements',
	'Partial<T>',
	'Pick<T, K>',
	'Omit<T, K>',
	'ReturnType<T>',
	'Parameters<T>',
	'get',
	'derived',
	'writable',
	'readable',
	'script lang="ts"'
];

tsTypes.forEach(item => addCompletion(item, item, 'typescript'));

const domTypes = [
	'HTMLElement',
	'HTMLDivElement',
	'HTMLSpanElement',
	'HTMLInputElement',
	'HTMLButtonElement',
	'HTMLFormElement',
	'HTMLAnchorElement',
	'HTMLCanvasElement',
	'HTMLImageElement',
	'CanvasRenderingContext2D',
	'CanvasRenderingContext',
	'MouseEvent',
	'KeyboardEvent',
	'FocusEvent',
	'InputEvent',
	'PointerEvent',
	'TouchEvent',
	'Event',
	'DragEvent',
	'CustomEvent',
	'WheelEvent',
	'ClipboardEvent',
	'UIEvent',
	'AnimationEvent',
	'TransitionEvent',
	'AudioContext',
	'MediaStream',
	'WebSocket',
	'Worker',
	'SharedWorker',
	'MessageEvent',
	'Document',
	'Window',
	'Node',
	'Text',
	'Comment',
	'Element',
	'EventTarget',
	'FormData',
	'Blob',
	'File',
	'FileList',
	'URL',
	'URLSearchParams',
	'Response',
	'Request',
	'Headers',
	'AbortController',
	'ReadableStream',
	'WritableStream',
	'TransformStream',
	'MutationObserver',
	'ResizeObserver',
	'IntersectionObserver',
	'Performance',
	'History',
	'Location',
	'Navigator',
	'Screen',
	'DOMRect',
	'DOMTokenList',
	'TextEncoder',
	'TextDecoder'
];

domTypes.forEach(type => addCompletion(type, type, 'dom-types'));

// Write to file
const outputFile = path.join(__dirname, 'svelte.json');
fs.writeFileSync(outputFile, JSON.stringify(completions, null, 2));

console.log(
	`✔️ Generated ${completions.length} completions to svelte-completions.json`
);
