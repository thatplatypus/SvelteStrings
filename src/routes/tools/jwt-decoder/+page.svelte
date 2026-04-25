<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { decodeJwt } from '$lib/tools/jwt-decoder';
	import { Badge } from '$lib/components/ui/badge';

	const tool = toolMap.get('jwt-decoder')!;
	let inputText = $state('');
	const result = $derived(decodeJwt(inputText));
	const outputText = $derived(
		result.valid
			? JSON.stringify({ header: result.header, payload: result.payload }, null, 2)
			: result.error ?? ''
	);
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		{#if inputText.trim()}
			{#if result.valid}
				<Badge variant="outline" class="text-green-500 border-green-500/30">Valid</Badge>
				{#if result.expired === true}
					<Badge variant="outline" class="text-red-500 border-red-500/30">Expired</Badge>
				{:else if result.expired === false}
					<Badge variant="outline" class="text-green-500 border-green-500/30">Active</Badge>
				{/if}
			{:else}
				<Badge variant="outline" class="text-red-500 border-red-500/30">Invalid</Badge>
			{/if}
		{/if}
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Paste a JWT token..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		{#if result.valid}
			<div class="grid gap-4">
				<div>
					<h3 class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Header
					</h3>
					<pre class="rounded-md bg-muted/50 p-3 font-mono text-sm">{JSON.stringify(result.header, null, 2)}</pre>
				</div>
				<div>
					<h3 class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Payload
					</h3>
					<pre class="rounded-md bg-muted/50 p-3 font-mono text-sm">{JSON.stringify(result.payload, null, 2)}</pre>
				</div>
			</div>
		{:else if result.error}
			<p class="text-sm text-destructive">{result.error}</p>
		{/if}
	{/snippet}
</ToolLayout>
