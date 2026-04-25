import { describe, it, expect } from 'vitest';
import { countStats, type TextStats } from '../word-counter';

describe('countStats', () => {
	it('counts basic text', () => {
		const stats = countStats('Hello world');
		expect(stats.words).toBe(2);
		expect(stats.characters).toBe(11);
		expect(stats.charactersNoSpaces).toBe(10);
		expect(stats.lines).toBe(1);
	});

	it('counts sentences', () => {
		const stats = countStats('Hello world. How are you? Fine!');
		expect(stats.sentences).toBe(3);
	});

	it('counts paragraphs', () => {
		const stats = countStats('First paragraph.\n\nSecond paragraph.\n\nThird.');
		expect(stats.paragraphs).toBe(3);
	});

	it('counts multiline text', () => {
		const stats = countStats('Line one\nLine two\nLine three');
		expect(stats.lines).toBe(3);
		expect(stats.words).toBe(6);
	});

	it('handles empty string', () => {
		const stats = countStats('');
		expect(stats.words).toBe(0);
		expect(stats.characters).toBe(0);
		expect(stats.lines).toBe(0);
		expect(stats.sentences).toBe(0);
		expect(stats.paragraphs).toBe(0);
	});

	it('handles whitespace only', () => {
		const stats = countStats('   \n\n   ');
		expect(stats.words).toBe(0);
	});
});
