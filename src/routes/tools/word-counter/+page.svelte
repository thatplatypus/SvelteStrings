<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { countStats } from '$lib/tools/word-counter';

	const tool = toolMap.get('word-counter')!;
	let inputText = $state('');
	const stats = $derived(countStats(inputText));

	const statItems = $derived([
		{ label: 'Words', value: stats.words },
		{ label: 'Characters', value: stats.characters },
		{ label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
		{ label: 'Lines', value: stats.lines },
		{ label: 'Sentences', value: stats.sentences },
		{ label: 'Paragraphs', value: stats.paragraphs }
	]);

	const outputText = $derived(statItems.map((s) => `${s.label}: ${s.value}`).join('\n'));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Paste or type text to analyze..."
			class="h-full w-full resize-none bg-transparent text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="grid gap-3">
			{#each statItems as stat (stat.label)}
				<div class="flex items-center justify-between rounded-md border px-4 py-3">
					<span class="text-sm text-muted-foreground">{stat.label}</span>
					<span class="text-2xl font-bold tabular-nums" style="color: var(--tool-accent)">
						{stat.value}
					</span>
				</div>
			{/each}
		</div>
	{/snippet}
</ToolLayout>
