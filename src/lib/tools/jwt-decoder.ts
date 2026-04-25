export interface JwtResult {
	valid: boolean;
	header?: Record<string, unknown>;
	payload?: Record<string, unknown>;
	expired?: boolean;
	error?: string;
}

function base64UrlDecode(str: string): string {
	const padded = str.replace(/-/g, '+').replace(/_/g, '/');
	const pad = padded.length % 4;
	const final = pad ? padded + '='.repeat(4 - pad) : padded;
	return atob(final);
}

export function decodeJwt(token: string): JwtResult {
	if (!token.trim()) {
		return { valid: false, error: 'Empty token' };
	}

	const parts = token.trim().split('.');
	if (parts.length !== 3) {
		return { valid: false, error: 'JWT must have 3 parts separated by dots' };
	}

	try {
		const header = JSON.parse(base64UrlDecode(parts[0]));
		const payload = JSON.parse(base64UrlDecode(parts[1]));

		let expired: boolean | undefined;
		if (typeof payload.exp === 'number') {
			expired = payload.exp < Math.floor(Date.now() / 1000);
		}

		return { valid: true, header, payload, expired };
	} catch {
		return { valid: false, error: 'Failed to decode token' };
	}
}
