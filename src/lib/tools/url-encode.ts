export function urlEncode(input: string): string {
	if (!input) return '';
	return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
	if (!input) return '';
	try {
		return decodeURIComponent(input);
	} catch {
		return 'Error: Invalid URL-encoded string';
	}
}
