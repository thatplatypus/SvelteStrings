import { describe, it, expect } from 'vitest';
import { generateLorem } from '../lorem-ipsum';

describe('generateLorem', () => {
	it('generates requested number of paragraphs', () => {
		const result = generateLorem({ paragraphs: 3 });
		expect(result.split('\n\n').length).toBe(3);
	});

	it('starts with "Lorem ipsum" when option enabled', () => {
		const result = generateLorem({ paragraphs: 1, startWithLorem: true });
		expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
	});

	it('does not start with "Lorem ipsum" when disabled', () => {
		const result = generateLorem({ paragraphs: 1, startWithLorem: false });
		expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(false);
	});

	it('wraps in <p> tags when option enabled', () => {
		const result = generateLorem({ paragraphs: 2, htmlTags: true });
		expect(result).toContain('<p>');
		expect(result).toContain('</p>');
	});

	it('generates at least some text', () => {
		const result = generateLorem({ paragraphs: 1 });
		expect(result.length).toBeGreaterThan(50);
	});
});
