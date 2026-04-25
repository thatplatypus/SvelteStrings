const WORDS = [
	'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
	'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
	'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
	'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
	'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
	'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
	'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
	'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'vitae', 'autem',
	'vel', 'eum', 'fugit', 'quo', 'voluptas', 'aspernatur', 'aut', 'odit',
	'fugiat', 'nihil', 'molestiae', 'consequatur', 'illum', 'dolorem', 'quia'
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

export interface LoremOptions {
	paragraphs: number;
	startWithLorem?: boolean;
	htmlTags?: boolean;
}

function randomWord(): string {
	return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(wordCount?: number): string {
	const count = wordCount ?? (5 + Math.floor(Math.random() * 10));
	const words = Array.from({ length: count }, randomWord);
	words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	return words.join(' ') + '.';
}

function generateParagraph(): string {
	const sentenceCount = 3 + Math.floor(Math.random() * 4);
	return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

export function generateLorem(options: LoremOptions): string {
	const { paragraphs, startWithLorem = true, htmlTags = false } = options;

	const paras: string[] = [];
	for (let i = 0; i < paragraphs; i++) {
		if (i === 0 && startWithLorem) {
			const rest = generateParagraph();
			paras.push(LOREM_START + '. ' + rest);
		} else {
			paras.push(generateParagraph());
		}
	}

	if (htmlTags) {
		return paras.map((p) => `<p>${p}</p>`).join('\n\n');
	}
	return paras.join('\n\n');
}
