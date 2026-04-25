import { tools, defaultOrder, type ToolDefinition } from '$lib/tools/registry';
import { loadOrder } from './card-order';

const STORAGE_KEY = 'sveltestrings:card-order';

function getStored(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(STORAGE_KEY);
}

let order = $state<string[]>(loadOrder(getStored(), defaultOrder));

export function getOrderedTools(): ToolDefinition[] {
	const map = new Map(tools.map((t) => [t.id, t]));
	return order.map((id) => map.get(id)!);
}

export function getOrder(): string[] {
	return order;
}

export function setOrder(newOrder: string[]): void {
	order = newOrder;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
}

export function resetOrder(): void {
	order = [...defaultOrder];
	localStorage.removeItem(STORAGE_KEY);
}
