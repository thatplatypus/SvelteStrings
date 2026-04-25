<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { diffLines, type Change } from 'diff';

	const tool = toolMap.get('string-diff')!;
	let originalText = $state('');
	let modifiedText = $state('');
	const changes = $derived<Change[]>(diffLines(originalText, modifiedText));
	const outputText = $derived(
		changes.map((c) => {
			const prefix = c.added ? '+ ' : c.removed ? '- ' : '  ';
			return c.value
				.split('\n')
				.filter((l) => l !== '')
				.map((l) => prefix + l)
				.join('\n');
		}).join('\n')
	);
</script>

<ToolLayout
	{tool}
	{outputText}
	onClear={() => (originalText = '')}
	onClearSecond={() => (modifiedText = '')}
>
	{#snippet input()}
		<textarea
			bind:value={originalText}
			placeholder="Original text..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet secondInput()}
		<textarea
			bind:value={modifiedText}
			placeholder="Modified text..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="font-mono text-sm">
			{#each changes as change}
				{#each change.value.split('\n').filter((l) => l !== '') as line}
					<div
						class="px-2 py-0.5 {change.added
							? 'bg-green-500/10 text-green-400'
							: change.removed
								? 'bg-red-500/10 text-red-400'
								: 'text-muted-foreground'}"
					>
						<span class="mr-2 select-none opacity-50">
							{change.added ? '+' : change.removed ? '-' : ' '}
						</span>{line}
					</div>
				{/each}
			{/each}
		</div>
	{/snippet}
</ToolLayout>
