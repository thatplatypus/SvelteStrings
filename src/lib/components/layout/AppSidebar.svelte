<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { tools } from '$lib/tools/registry';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { footer }: { footer?: Snippet } = $props();
	const currentPath = $derived($page.url.pathname);
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<a href="{base}/" class="flex items-center gap-2 px-2 py-1.5">
			<span class="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden"
				>SvelteStrings</span
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
		<div class="flex items-center gap-1 px-2">
			{@render footer?.()}
		</div>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
