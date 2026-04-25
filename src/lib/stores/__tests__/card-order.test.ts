import { describe, it, expect } from 'vitest';
import { loadOrder, validateOrder } from '../card-order';

const defaultOrder = ['a', 'b', 'c', 'd'];

describe('loadOrder', () => {
	it('returns default order when no stored value', () => {
		expect(loadOrder(null, defaultOrder)).toEqual(defaultOrder);
	});

	it('returns default order for invalid JSON', () => {
		expect(loadOrder('not-json', defaultOrder)).toEqual(defaultOrder);
	});

	it('returns stored order when valid', () => {
		const stored = JSON.stringify(['c', 'a', 'b', 'd']);
		expect(loadOrder(stored, defaultOrder)).toEqual(['c', 'a', 'b', 'd']);
	});
});

describe('validateOrder', () => {
	it('strips IDs not in current registry', () => {
		expect(validateOrder(['a', 'removed', 'b', 'c', 'd'], defaultOrder)).toEqual([
			'a',
			'b',
			'c',
			'd'
		]);
	});

	it('appends new tools not in stored order', () => {
		expect(validateOrder(['b', 'a'], ['a', 'b', 'c'])).toEqual(['b', 'a', 'c']);
	});

	it('handles empty stored order', () => {
		expect(validateOrder([], defaultOrder)).toEqual(defaultOrder);
	});

	it('handles stored order with removed and new tools', () => {
		expect(validateOrder(['c', 'removed', 'a'], ['a', 'b', 'c', 'd'])).toEqual([
			'c',
			'a',
			'b',
			'd'
		]);
	});
});
