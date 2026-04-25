export function base64Encode(input: string): string {
	if (!input) return '';
	const bytes = new TextEncoder().encode(input);
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	return btoa(binary);
}

export function base64Decode(input: string): string {
	if (!input) return '';
	try {
		const binary = atob(input);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch {
		return 'Error: Invalid Base64 string';
	}
}
