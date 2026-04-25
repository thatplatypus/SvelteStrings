import { describe, it, expect } from 'vitest';
import { hexToRgb } from '../colors';

describe('hexToRgb', () => {
	it('converts 6-digit hex to rgb string', () => {
		expect(hexToRgb('#8b5cf6')).toBe('139, 92, 246');
	});

	it('converts uppercase hex', () => {
		expect(hexToRgb('#FF0000')).toBe('255, 0, 0');
	});

	it('converts black', () => {
		expect(hexToRgb('#000000')).toBe('0, 0, 0');
	});

	it('converts white', () => {
		expect(hexToRgb('#ffffff')).toBe('255, 255, 255');
	});

	it('handles hex without hash', () => {
		expect(hexToRgb('3b82f6')).toBe('59, 130, 246');
	});
});
