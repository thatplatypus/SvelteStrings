<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';

	let { text = '' }: { text: string } = $props();
	let copied = $state(false);

	async function handleCopy() {
		if (!text) return;
		await copyToClipboard(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	onclick={handleCopy}
	class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
	disabled={!text}
	aria-label="Copy to clipboard"
>
	{#if copied}
		<Check class="size-3.5 text-green-500" />
	{:else}
		<Copy class="size-3.5" />
	{/if}
</button>
