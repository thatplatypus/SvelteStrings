import { describe, it, expect } from 'vitest';
import { generateHash } from '../hash-generator';

describe('generateHash', () => {
	it('generates MD5 hash', async () => {
		const hash = await generateHash('hello', 'md5');
		expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
	});

	it('generates SHA-1 hash', async () => {
		const hash = await generateHash('hello', 'sha1');
		expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
	});

	it('generates SHA-256 hash', async () => {
		const hash = await generateHash('hello', 'sha256');
		expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
	});

	it('handles empty string', async () => {
		const hash = await generateHash('', 'sha256');
		expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	});
});
