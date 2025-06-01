# 📝 Changelogs

## 1.0.0 (Prototype)

Intial release with the following:
* Automatic detection if you're in a Svelte / SvelteKit project.
* Added Svelte's Core.
* Added TypeScript's Core and DOM Types.

This is my first plugin; pls dont judge :]

## 1.0.1 (Prototype)

Minor changes in the code:
* Make the detection more dynamic (The plugin works on any svelte file now;)
* Refactored code
* Javascript supports (mid)
* Changes Typescript's configuration, making it dynamic. It now based on the usage of "lang='ts'" on script tag

## 1.2.0 (Prototype)

Big improvements:
* Added a smart context-based filtering suggestion.
* Made the detection of language more dynamic and reliable.
* Cursor aware intellisense: Specific completers such as javascript/typescript/css/sass only activates on their appropriate tag. (script/style)
* Introduced Web Workers to offload heavy processing that might lag the UI.
* Keep the UI responsive.

> Note: CSS/SASS is **Still in progress**.
> I'm currently in **Petsa De Peligro** (aka. broke TwT), and I can't find good references for CSS/SASS at the moment.
> I'll try my best to deliver it in the next update :3