/*
 * This file is for more flexible creation of svelte.json.
 * Run ```node exist.js``` to create ```svelte.json```
 */

const fs = require('fs');
const path = require('path');

const svelte = [];
const typescript = [];
const javascript = [];

function addCompletion(
	caption,
	value = caption,
	meta = 'svelte',
	target = [],
	score = 1000
) {
	target.push({ caption, value, meta, score });
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

svelteCore.forEach(item =>
	addCompletion(item, item, 'SvelteKit: core', svelte)
);

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

tsTypes.forEach(item =>
	addCompletion(item, item, 'Typescript: core', typescript)
);

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

domTypes.forEach(type =>
	addCompletion(type, type, 'Typescript: DomType', typescript)
);

const javascriptCore = [
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'enum',
	'export',
	'extends',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'let',
	'new',
	'return',
	'super',
	'switch',
	'this',
	'throw',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'with',
	'yield',
	'await',
	'as',
	'implements',
	'interface',
	'package',
	'private',
	'protected',
	'public',
	'static'
];

javascriptCore.forEach(type =>
	addCompletion(type, type, 'Javascript: Core', javascript)
);

const javascriptClasses = [
	'Array',
	'ArrayBuffer',
	'Boolean',
	'BigInt',
	'Date',
	'Error',
	'EvalError',
	'Float32Array',
	'Float64Array',
	'Function',
	'Infinity',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Map',
	'Math',
	'NaN',
	'Number',
	'Object',
	'Promise',
	'Proxy',
	'RangeError',
	'ReferenceError',
	'RegExp',
	'Set',
	'SharedArrayBuffer',
	'String',
	'Symbol',
	'SyntaxError',
	'TypeError',
	'Uint8Array',
	'Uint8ClampedArray',
	'Uint16Array',
	'Uint32Array',
	'URIError',
	'WeakMap',
	'WeakSet'
];

javascriptClasses.forEach(type =>
	addCompletion(type, type, 'Javascript: Class', javascript)
);

const javascriptFunction = [
	'eval',
	'isFinite',
	'isNaN',
	'parseFloat',
	'parseInt',
	'decodeURI',
	'decodeURIComponent',
	'encodeURI',
	'encodeURIComponent',
	'escape',
	'unescape'
];

javascriptFunction.forEach(type =>
	addCompletion(type, type, 'Javascript: Function', javascript)
);

const javascriptModules = ['import', 'export', 'default', 'from', 'as'];

javascriptModules.forEach(type =>
	addCompletion(type, type, 'Javascript: Modules', javascript)
);

const javascriptConsole = [
	'console',
	'console.log',
	'console.warn',
	'console.error',
	'console.info',
	'console.table'
];

javascriptConsole.forEach(type =>
	addCompletion(type, type, 'Javascript: Console', javascript)
);

javascriptDom = [
	'window',
	'document',
	'navigator',
	'location',
	'history',
	'localStorage',
	'sessionStorage',
	'fetch',
	'setTimeout',
	'clearTimeout',
	'setInterval',
	'clearInterval',
	'requestAnimationFrame',
	'cancelAnimationFrame'
];

javascriptDom.forEach(type =>
	addCompletion(type, type, 'Javascript: Dom', javascript)
);

addCompletion('use strict', '"use strict"', 'Javascript: core', javascript);

// Write to file
const outputFileSvelte = path.join(__dirname, 'svelte.json');
const outputFileTypescript = path.join(__dirname, 'typescript.json');
const outputFileJavascript = path.join(__dirname, 'javascript.json');
fs.writeFileSync(outputFileSvelte, JSON.stringify(svelte, null, 2));
fs.writeFileSync(outputFileTypescript, JSON.stringify(typescript, null, 2));
fs.writeFileSync(outputFileJavascript, JSON.stringify(javascript, null, 2));

console.log(
	`✔️ Generated ${svelte.length} completions to svelte-completions.json`,
	`✔️ Generated ${typescript.length} completions to svelte-completions.json`,
	`✔️ Generated ${javascript.length} completions to svelte-completions.json`
);
