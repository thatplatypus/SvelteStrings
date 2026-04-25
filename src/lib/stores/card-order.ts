export function loadOrder(stored: string | null, defaultOrder: string[]): string[] {
	if (!stored) return defaultOrder;
	try {
		const parsed: string[] = JSON.parse(stored);
		if (!Array.isArray(parsed)) return defaultOrder;
		return validateOrder(parsed, defaultOrder);
	} catch {
		return defaultOrder;
	}
}

export function validateOrder(stored: string[], currentIds: string[]): string[] {
	const currentSet = new Set(currentIds);
	const valid = stored.filter((id) => currentSet.has(id));
	const validSet = new Set(valid);
	for (const id of currentIds) {
		if (!validSet.has(id)) valid.push(id);
	}
	return valid;
}
