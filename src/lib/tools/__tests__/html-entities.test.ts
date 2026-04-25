import { describe, it, expect } from 'vitest';
import { htmlEncode, htmlDecode } from '../html-entities';

describe('htmlEncode', () => {
	it('encodes basic HTML characters', () => {
		expect(htmlEncode('<div class="test">&</div>')).toBe(
			'&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
		);
	});

	it('encodes empty string', () => {
		expect(htmlEncode('')).toBe('');
	});

	it('encodes single quotes', () => {
		expect(htmlEncode("it's")).toBe('it&#39;s');
	});

	it('leaves normal text unchanged', () => {
		expect(htmlEncode('Hello World')).toBe('Hello World');
	});
});

describe('htmlDecode', () => {
	it('decodes named entities', () => {
		expect(htmlDecode('&lt;div&gt;&amp;&lt;/div&gt;')).toBe('<div>&</div>');
	});

	it('decodes numeric entities', () => {
		expect(htmlDecode('&#60;&#62;')).toBe('<>');
	});

	it('decodes hex entities', () => {
		expect(htmlDecode('&#x3C;&#x3E;')).toBe('<>');
	});

	it('decodes empty string', () => {
		expect(htmlDecode('')).toBe('');
	});
});
