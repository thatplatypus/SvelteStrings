<script lang="ts">
	import { X } from '@lucide/svelte';

	let { onclick, disabled = false }: { onclick: () => void; disabled?: boolean } = $props();
</script>

<button
	{onclick}
	class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
	{disabled}
	aria-label="Clear"
>
	<X class="size-3.5" />
</button>
