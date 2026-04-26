<script lang="ts">
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { getOrderedTools, setOrder } from '$lib/stores/card-order.svelte';
	import type { ToolDefinition } from '$lib/tools/registry';
	import { settings } from '$lib/stores/settings.svelte';
	import ToolCard from './ToolCard.svelte';

	let items = $state(getOrderedTools().map((t) => ({ ...t })));
	const flipDurationMs = 200;
	const dropTargetStyle = $derived({
		outline: `2px dashed ${settings.accentColor}`,
		borderRadius: '0.75rem'
	});

	function handleConsider(e: CustomEvent<DndEvent<ToolDefinition>>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent<ToolDefinition>>) {
		items = e.detail.items;
		setOrder(items.map((i) => i.id));
	}
</script>

<div
	class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	use:dndzone={{ items, flipDurationMs, type: 'tools', dropTargetStyle }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each items as tool (tool.id)}
		<ToolCard {tool} />
	{/each}
</div>
