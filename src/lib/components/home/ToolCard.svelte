<script lang="ts">
	import { base } from '$app/paths';
	import type { ToolDefinition } from '$lib/tools/registry';
	import { hexToRgb } from '$lib/utils/colors';

	let { tool }: { tool: ToolDefinition } = $props();

	const rgb = $derived(hexToRgb(tool.color));
</script>

<a
	href="{base}{tool.route}"
	class="tool-card group relative overflow-hidden rounded-xl border p-6 backdrop-blur-xs transition-all duration-200 ease-out"
	style="
		--card-rgb: {rgb};
		--card-color: {tool.color};
		border-color: rgba({rgb}, 0.1);
	"
>
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.18]"
		style="background: radial-gradient(ellipse at top left, rgba({rgb}, 0.6), transparent 70%)"
	></div>

	<div class="relative">
		<tool.icon
			class="size-8 opacity-80 transition-opacity duration-200 group-hover:opacity-100"
			style="color: {tool.color}"
		/>
		<h3 class="mt-3 font-semibold text-foreground">{tool.name}</h3>
		<p class="mt-1 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70">
			{tool.description}
		</p>
	</div>
</a>

<style>
	.tool-card:hover {
		border-color: rgba(var(--card-rgb), 0.4);
		box-shadow:
			0 0 20px rgba(var(--card-rgb), 0.15),
			0 0 40px rgba(var(--card-rgb), 0.05);
	}
</style>
