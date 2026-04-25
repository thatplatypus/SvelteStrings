<script lang="ts">
	import ToolLayout from '$lib/components/layout/ToolLayout.svelte';
	import { toolMap } from '$lib/tools/registry';
	import { urlEncode, urlDecode } from '$lib/tools/url-encode';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	const tool = toolMap.get('url-encode')!;
	let inputText = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	const outputText = $derived(mode === 'encode' ? urlEncode(inputText) : urlDecode(inputText));
</script>

<ToolLayout {tool} {outputText} onClear={() => (inputText = '')}>
	{#snippet controls()}
		<ToggleGroup.Root type="single" value={mode} onValueChange={(v) => v && (mode = v)}>
			<ToggleGroup.Item value="encode" class="text-xs">Encode</ToggleGroup.Item>
			<ToggleGroup.Item value="decode" class="text-xs">Decode</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
	{#snippet input()}
		<textarea
			bind:value={inputText}
			placeholder={mode === 'encode' ? 'Text to encode...' : 'URL-encoded text to decode...'}
			class="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
		></textarea>
	{/snippet}
	{#snippet output()}
		<pre class="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
	{/snippet}
</ToolLayout>
