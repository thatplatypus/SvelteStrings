import md5 from 'js-md5';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256';

export const algorithms: { value: HashAlgorithm; label: string; warning?: string }[] = [
	{ value: 'md5', label: 'MD5', warning: 'Not cryptographically secure' },
	{ value: 'sha1', label: 'SHA-1' },
	{ value: 'sha256', label: 'SHA-256' }
];

async function webCryptoHash(input: string, algorithm: string): Promise<string> {
	const data = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHash(input: string, algorithm: HashAlgorithm): Promise<string> {
	switch (algorithm) {
		case 'md5':
			return md5(input);
		case 'sha1':
			return webCryptoHash(input, 'SHA-1');
		case 'sha256':
			return webCryptoHash(input, 'SHA-256');
	}
}

export async function generateAllHashes(
	input: string
): Promise<{ algorithm: HashAlgorithm; label: string; hash: string; warning?: string }[]> {
	return Promise.all(
		algorithms.map(async (a) => ({
			algorithm: a.value,
			label: a.label,
			hash: await generateHash(input, a.value),
			warning: a.warning
		}))
	);
}
