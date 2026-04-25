import { describe, it, expect } from 'vitest';
import { urlEncode, urlDecode } from '../url-encode';

describe('urlEncode', () => {
	it('encodes special characters', () => {
		expect(urlEncode('hello world&foo=bar')).toBe('hello%20world%26foo%3Dbar');
	});

	it('encodes empty string', () => {
		expect(urlEncode('')).toBe('');
	});

	it('preserves unreserved characters', () => {
		expect(urlEncode('hello-world_test.123~')).toBe('hello-world_test.123~');
	});
});

describe('urlDecode', () => {
	it('decodes percent-encoded string', () => {
		expect(urlDecode('hello%20world%26foo%3Dbar')).toBe('hello world&foo=bar');
	});

	it('decodes empty string', () => {
		expect(urlDecode('')).toBe('');
	});

	it('returns error for malformed input', () => {
		expect(urlDecode('%ZZ')).toContain('Error');
	});
});
