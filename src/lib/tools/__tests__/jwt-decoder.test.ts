import { describe, it, expect } from 'vitest';
import { decodeJwt } from '../jwt-decoder';

const VALID_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
	it('decodes a valid JWT', () => {
		const result = decodeJwt(VALID_JWT);
		expect(result.valid).toBe(true);
		expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
		expect(result.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
	});

	it('returns invalid for garbage input', () => {
		const result = decodeJwt('not-a-jwt');
		expect(result.valid).toBe(false);
		expect(result.error).toBeDefined();
	});

	it('returns invalid for empty string', () => {
		const result = decodeJwt('');
		expect(result.valid).toBe(false);
	});

	it('detects expired tokens', () => {
		const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 }));
		const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
		const result = decodeJwt(token);
		expect(result.expired).toBe(true);
	});

	it('detects non-expired tokens', () => {
		const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
		const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
		const result = decodeJwt(token);
		expect(result.expired).toBe(false);
	});
});
