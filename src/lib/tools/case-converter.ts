export type CaseType = 'camel' | 'pascal' | 'snake' | 'kebab' | 'screaming';

export const caseTypes: { value: CaseType; label: string }[] = [
	{ value: 'camel', label: 'camelCase' },
	{ value: 'pascal', label: 'PascalCase' },
	{ value: 'snake', label: 'snake_case' },
	{ value: 'kebab', label: 'kebab-case' },
	{ value: 'screaming', label: 'SCREAMING_SNAKE' }
];

function tokenize(input: string): string[] {
	return input
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.replace(/[_\-\s]+/g, ' ')
		.trim()
		.toLowerCase()
		.split(' ')
		.filter(Boolean);
}

export function convertCase(input: string, target: CaseType): string {
	if (!input) return '';
	const words = tokenize(input);
	if (words.length === 0) return '';

	switch (target) {
		case 'camel':
			return words[0] + words.slice(1).map(capitalize).join('');
		case 'pascal':
			return words.map(capitalize).join('');
		case 'snake':
			return words.join('_');
		case 'kebab':
			return words.join('-');
		case 'screaming':
			return words.join('_').toUpperCase();
	}
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}
