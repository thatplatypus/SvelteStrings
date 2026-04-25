const ENCODE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

const DECODE_MAP: Record<string, string> = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'",
	'&apos;': "'"
};

export function htmlEncode(input: string): string {
	if (!input) return '';
	return input.replace(/[&<>"']/g, (ch) => ENCODE_MAP[ch] ?? ch);
}

export function htmlDecode(input: string): string {
	if (!input) return '';
	return input
		.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (match, hex, dec, named) => {
			if (hex) return String.fromCharCode(parseInt(hex, 16));
			if (dec) return String.fromCharCode(parseInt(dec, 10));
			const namedEntity = `&${named};`;
			return DECODE_MAP[namedEntity] ?? match;
		});
}
