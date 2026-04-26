<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { settings, type BackgroundEffect } from '$lib/stores/settings.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let showCustomPicker = $state(false);
	let customHex = $state(settings.accentColor);

	const effects: { value: BackgroundEffect; label: string; icon: string }[] = [
		{ value: 'classic', label: 'Classic', icon: '🎨' },
		{ value: 'aurora', label: 'Aurora', icon: '🌊' },
		{ value: 'matrix', label: 'Matrix', icon: '💻' }
	];

	const presetColors = [
		'#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b',
		'#ef4444', '#ec4899', '#06b6d4'
	];

	function selectEffect(value: BackgroundEffect) {
		settings.backgroundEffect = value;
	}

	function selectColor(hex: string) {
		showCustomPicker = false;
		settings.accentColor = hex;
	}

	function handleCustomColor(color: { hex: string | null }) {
		if (color.hex) {
			customHex = color.hex;
			settings.accentColor = color.hex;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>Customize the look and feel</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-6 py-4">
			<div>
				<p class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
					Background Effect
				</p>
				<div class="grid grid-cols-3 gap-2">
					{#each effects as effect}
						<button
							onclick={() => selectEffect(effect.value)}
							class="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors
								{settings.backgroundEffect === effect.value
									? 'border-primary bg-accent'
									: 'border-border hover:border-primary/50'}"
						>
							<span class="text-xl">{effect.icon}</span>
							<span class="text-sm">{effect.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div>
				<p class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
					Default Accent Color
				</p>
				<div class="flex flex-wrap gap-2">
					{#each presetColors as color}
						<button
							onclick={() => selectColor(color)}
							class="size-8 rounded-full transition-shadow"
							style="background-color: {color}; box-shadow: {settings.accentColor === color ? '0 0 0 2px var(--background), 0 0 0 4px ' + color : 'none'};"
							aria-label="Select {color}"
						></button>
					{/each}
					<button
						onclick={() => (showCustomPicker = !showCustomPicker)}
						class="flex size-8 items-center justify-center rounded-full text-sm font-bold text-white transition-shadow"
						style="background: conic-gradient(from 0deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8b00ff, #ff0000);"
						aria-label="Custom color"
					>
						+
					</button>
				</div>
				{#if showCustomPicker}
					<div class="mt-3">
						<ColorPicker
							bind:hex={customHex}
							onInput={handleCustomColor}
							isAlpha={false}
							isDialog={false}
						/>
					</div>
				{/if}
				<p class="text-muted-foreground mt-2 text-xs">
					Used on home page when no tool is selected
				</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
