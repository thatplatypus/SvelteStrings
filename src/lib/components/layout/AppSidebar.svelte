<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { tools } from '$lib/tools/registry';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte';
	import { PanelLeftClose, PanelLeftOpen } from '@lucide/svelte';

	let { footer }: { footer?: Snippet } = $props();
	const currentPath = $derived($page.url.pathname);
	const sidebar = useSidebar();
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<a href="{base}/" class="flex items-center gap-2 px-2 py-1.5">
			<span class="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden"
				>String Toolkit</span
			>
		</a>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each tools as tool (tool.id)}
						{@const isActive = currentPath === `${base}${tool.route}`}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton {isActive} tooltipContent={tool.name}>
								{#snippet child({ props })}
									<a
										href="{base}{tool.route}"
										{...props}
										style={isActive ? `color: ${tool.color};` : ''}
									>
										<tool.icon class="size-4" />
										<span>{tool.name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<div class="flex items-center gap-1 px-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:px-0">
			{@render footer?.()}
			<button
				onclick={() => sidebar.toggle()}
				class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
				aria-label="Toggle sidebar"
			>
				{#if sidebar.open}
					<PanelLeftClose class="size-4" />
				{:else}
					<PanelLeftOpen class="size-4" />
				{/if}
			</button>
		</div>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
