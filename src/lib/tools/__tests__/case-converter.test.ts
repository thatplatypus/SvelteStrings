import { describe, it, expect } from 'vitest';
import { convertCase, type CaseType } from '../case-converter';

describe('convertCase', () => {
	const input = 'hello world example';

	it('converts to camelCase', () => {
		expect(convertCase(input, 'camel')).toBe('helloWorldExample');
	});

	it('converts to PascalCase', () => {
		expect(convertCase(input, 'pascal')).toBe('HelloWorldExample');
	});

	it('converts to snake_case', () => {
		expect(convertCase(input, 'snake')).toBe('hello_world_example');
	});

	it('converts to kebab-case', () => {
		expect(convertCase(input, 'kebab')).toBe('hello-world-example');
	});

	it('converts to SCREAMING_SNAKE_CASE', () => {
		expect(convertCase(input, 'screaming')).toBe('HELLO_WORLD_EXAMPLE');
	});

	it('handles camelCase input', () => {
		expect(convertCase('helloWorldExample', 'snake')).toBe('hello_world_example');
	});

	it('handles PascalCase input', () => {
		expect(convertCase('HelloWorldExample', 'kebab')).toBe('hello-world-example');
	});

	it('handles snake_case input', () => {
		expect(convertCase('hello_world_example', 'camel')).toBe('helloWorldExample');
	});

	it('handles empty string', () => {
		expect(convertCase('', 'camel')).toBe('');
	});
});
