<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToolDefinition } from '$lib/tools/registry';
	import { hexToRgb } from '$lib/utils/colors';
	import CopyButton from '$lib/components/shared/CopyButton.svelte';
	import ClearButton from '$lib/components/shared/ClearButton.svelte';

	let {
		tool,
		input,
		output,
		controls,
		secondInput,
		outputText = '',
		onClear,
		onClearSecond
	}: {
		tool: ToolDefinition;
		input: Snippet;
		output?: Snippet;
		controls?: Snippet;
		secondInput?: Snippet;
		outputText?: string;
		onClear?: () => void;
		onClearSecond?: () => void;
	} = $props();

	let rgb = $derived(hexToRgb(tool.color));
</script>

<div class="flex h-full flex-col" style="--tool-accent: {tool.color}; --tool-accent-rgb: {rgb};">
	<!-- Slim header -->
	<div class="flex items-center gap-3 border-b px-4 py-2.5">
		<tool.icon class="size-5" style="color: {tool.color}" />
		<h1 class="text-sm font-semibold">{tool.name}</h1>
		{#if controls}
			<div class="ml-auto flex items-center gap-2">
				{@render controls()}
			</div>
		{/if}
	</div>

	<!-- Content area -->
	<div class="flex-1 overflow-hidden p-4">
		{#if tool.layout === 'split'}
			<div class="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Input panel -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Input</span
						>
						{#if onClear}
							<ClearButton onclick={onClear} />
						{/if}
					</div>
					<div class="flex-1 overflow-auto p-3">
						{@render input()}
					</div>
				</div>
				<!-- Output panel -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Output</span
						>
						<CopyButton text={outputText} />
					</div>
					<div class="flex-1 overflow-auto p-3">
						{#if output}
							{@render output()}
						{/if}
					</div>
				</div>
			</div>
		{:else if tool.layout === 'single'}
			<div class="h-full overflow-hidden rounded-lg border">
				{@render input()}
			</div>
		{:else if tool.layout === 'dual-input'}
			<div class="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex flex-col gap-4">
					<!-- First input -->
					<div class="flex flex-1 flex-col overflow-hidden rounded-lg border">
						<div class="flex items-center justify-between border-b px-3 py-1.5">
							<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
								>Original</span
							>
							{#if onClear}
								<ClearButton onclick={onClear} />
							{/if}
						</div>
						<div class="flex-1 overflow-auto p-3">
							{@render input()}
						</div>
					</div>
					<!-- Second input -->
					{#if secondInput}
						<div class="flex flex-1 flex-col overflow-hidden rounded-lg border">
							<div class="flex items-center justify-between border-b px-3 py-1.5">
								<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
									>Modified</span
								>
								{#if onClearSecond}
									<ClearButton onclick={onClearSecond} />
								{/if}
							</div>
							<div class="flex-1 overflow-auto p-3">
								{@render secondInput()}
							</div>
						</div>
					{/if}
				</div>
				<!-- Output -->
				<div class="flex flex-col overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b px-3 py-1.5">
						<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
							>Diff</span
						>
						<CopyButton text={outputText} />
					</div>
					<div class="flex-1 overflow-auto p-3">
						{#if output}
							{@render output()}
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
