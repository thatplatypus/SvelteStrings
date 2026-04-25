import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../base64';

describe('base64Encode', () => {
	it('encodes ASCII string', () => {
		expect(base64Encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
	});

	it('encodes empty string', () => {
		expect(base64Encode('')).toBe('');
	});

	it('encodes UTF-8 characters', () => {
		const encoded = base64Encode('Hello 🌍');
		expect(base64Decode(encoded)).toBe('Hello 🌍');
	});
});

describe('base64Decode', () => {
	it('decodes Base64 string', () => {
		expect(base64Decode('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!');
	});

	it('decodes empty string', () => {
		expect(base64Decode('')).toBe('');
	});

	it('returns error message for invalid Base64', () => {
		expect(base64Decode('not-valid-base64!!!')).toContain('Error');
	});
});
