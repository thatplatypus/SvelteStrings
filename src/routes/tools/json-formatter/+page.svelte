<script lang="ts">
	import { onMount } from 'svelte';
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import './json-editor.css';

	const tool = toolMap.get('json-formatter')!;

	let JSONEditor = $state<typeof import('svelte-jsoneditor').JSONEditor>();
	let content = $state({
		text: '{\n  "hello": "world",\n  "number": 42,\n  "array": [1, 2, 3]\n}'
	});

	onMount(async () => {
		const mod = await import('svelte-jsoneditor');
		JSONEditor = mod.JSONEditor;
	});
</script>

<ToolLayout {tool}>
	{#snippet input()}
		<div class="json-editor-wrapper">
			{#if JSONEditor}
				<JSONEditor bind:content />
			{:else}
				<div class="flex h-full items-center justify-center text-muted-foreground">
					Loading editor...
				</div>
			{/if}
		</div>
	{/snippet}
</ToolLayout>
