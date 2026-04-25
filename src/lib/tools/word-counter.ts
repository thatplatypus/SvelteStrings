export interface TextStats {
	words: number;
	characters: number;
	charactersNoSpaces: number;
	lines: number;
	sentences: number;
	paragraphs: number;
}

export function countStats(input: string): TextStats {
	if (!input.trim()) {
		return { words: 0, characters: 0, charactersNoSpaces: 0, lines: 0, sentences: 0, paragraphs: 0 };
	}

	const words = input.trim().split(/\s+/).filter(Boolean).length;
	const characters = input.length;
	const charactersNoSpaces = input.replace(/\s/g, '').length;
	const lines = input.split('\n').length;
	const sentences = input.split(/[.!?]+/).filter((s) => s.trim()).length;
	const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length;

	return { words, characters, charactersNoSpaces, lines, sentences, paragraphs };
}
