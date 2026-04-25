<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { generateAllHashes } from '$lib/tools/hash-generator';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import { Badge } from '$lib/components/ui/badge';

	const tool = toolMap.get('hash-generator')!;
	let inputText = $state('');
	let hashes = $state<{ algorithm: string; label: string; hash: string; warning?: string }[]>([]);

	$effect(() => {
		generateAllHashes(inputText).then((results) => {
			hashes = results;
		});
	});

	const outputText = $derived(hashes.map((h) => `${h.label}: ${h.hash}`).join('\n'));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Text to hash..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<div class="grid gap-3">
			{#each hashes as item (item.algorithm)}
				<div class="rounded-md border px-4 py-3">
					<div class="mb-1 flex items-center gap-2">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							{item.label}
						</span>
						{#if item.warning}
							<Badge variant="outline" class="text-[10px] text-yellow-500 border-yellow-500/30">
								{item.warning}
							</Badge>
						{/if}
						<div class="ml-auto">
							<CopyButton text={item.hash} />
						</div>
					</div>
					<pre class="break-all font-mono text-sm">{item.hash}</pre>
				</div>
			{/each}
		</div>
	{/snippet}
</ToolLayout>
