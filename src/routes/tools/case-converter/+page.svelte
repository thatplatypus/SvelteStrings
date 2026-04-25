<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { convertCase, caseTypes, type CaseType } from '$lib/tools/case-converter';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('case-converter')!;
	let inputText = $state('');
	let targetCase = $state<CaseType>('camel');
	const outputText = $derived(convertCase(inputText, targetCase));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root
			type="single"
			value={targetCase}
			onValueChange={(v) => v && (targetCase = v)}
		>
			{#each caseTypes as ct (ct.value)}
				<ToggleGroup.Item value={ct.value} class="text-xs">{ct.label}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder="Text to convert..."
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
