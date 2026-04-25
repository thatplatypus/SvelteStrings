<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from '@lucide/svelte';
</script>

<button
	onclick={toggleMode}
	class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
	aria-label="Toggle theme"
>
	<Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<Moon
		class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
</button>
