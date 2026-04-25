<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	const tool = toolMap.get('markdown-preview')!;

	const DEFAULT_MARKDOWN = `# Hello World

This is a **markdown** preview tool.

- Item one
- Item two
- Item three

\`\`\`javascript
console.log('Hello!');
\`\`\`
`;

	let inputText = $state(DEFAULT_MARKDOWN);
	const outputText = $derived(inputText);
	let purify = $state<{ sanitize: (dirty: string) => string } | null>(null);

	onMount(async () => {
		const mod = await import('dompurify');
		purify = mod.default;
	});

	const renderedHtml = $derived(
		purify ? purify.sanitize(marked.parse(inputText) as string) : (marked.parse(inputText) as string)
	);
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Write markdown..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="prose prose-sm dark:prose-invert max-w-none">
			{@html renderedHtml}
		</div>
	{/snippet}
</ToolLayout>
