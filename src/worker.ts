interface TagRange {
	open: number;
	close: number;
	lang?: string;
}

function findTag(tag: string, content: string): TagRange | null {
	const openTagReg = new RegExp(`<${tag}(\\s[^>]*)?>`, 'i');
	const closeTagReg = new RegExp(`</${tag}>`, 'i');

	const lines = content.split('\n');

	let close = -1;
	let open = -1;
	let lang: string | undefined;

	for (let i = 0; i < lines.length; i++) {
		if (open < 0 && openTagReg.test(lines[i])) {
			open = i;
			const attrMatch = lines[i].match(/lang\s*=\s*["'](\w+)["']/);
			if (attrMatch) lang = attrMatch[1];
		} else if (open >= 0 && closeTagReg.test(lines[i])) {
			close = i;
			break;
		}
	}

	if (open >= 0 && close >= 0) return { open, close, lang };

	return null;
}

self.onmessage = (e: MessageEvent) => {
	const content = e.data as string;
	const script = findTag('script', content);
	const style = findTag('style', content);

	self.postMessage({ script, style });
};
