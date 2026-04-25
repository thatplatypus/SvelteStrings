<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { generateLorem } from '$lib/tools/lorem-ipsum';
	import { Button } from '$lib/components/ui/button';

	const tool = toolMap.get('lorem-ipsum')!;
	let paragraphs = $state(3);
	let startWithLorem = $state(true);
	let htmlTags = $state(false);
	let outputText = $state(generateLorem({ paragraphs: 3, startWithLorem: true, htmlTags: false }));

	function regenerate() {
		outputText = generateLorem({ paragraphs, startWithLorem, htmlTags });
	}
</script>

<ToolLayout {tool} {outputText} onClear={() => (outputText = '')}>
	{#snippet controls()}
		<Button variant="outline" size="sm" class="text-xs" onclick={regenerate}>Generate</Button>
	{/snippet}
	{#snippet input()}
		<div class="grid gap-4">
			<div class="flex items-center gap-3">
				<label for="para-count" class="text-sm text-muted-foreground">Paragraphs</label>
				<input
					id="para-count"
					type="number"
					min="1"
					max="50"
					bind:value={paragraphs}
					class="w-20 rounded-md border bg-transparent px-2 py-1 text-sm"
				/>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={startWithLorem} class="rounded" />
				Start with "Lorem ipsum..."
			</label>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={htmlTags} class="rounded" />
				Wrap in &lt;p&gt; tags
			</label>
		</div>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
