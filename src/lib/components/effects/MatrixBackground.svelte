<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { colorHex = '#8b5cf6' }: { colorHex?: string } = $props();

	const STREAM_COUNT = 60;

	const LEFT_POSITIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
	const TOP_VALUES = [200, 250, 300, 320, 380, 400, 420, 500, 520, 530, 600, 650, 680, 700, 800, 900];

	interface Stream {
		left: number;
		top: number;
		big: boolean;
		delay: boolean;
	}

	let streams = $state<Stream[]>([]);

	function initializeStreams() {
		const result: Stream[] = [];
		for (let i = 0; i < STREAM_COUNT; i++) {
			result.push({
				left: LEFT_POSITIONS[Math.floor(Math.random() * LEFT_POSITIONS.length)],
				top: TOP_VALUES[Math.floor(Math.random() * TOP_VALUES.length)],
				big: Math.random() > 0.7,
				delay: Math.random() > 0.5
			});
		}
		streams = result;
	}

	function handleResize() {
		initializeStreams();
	}

	onMount(() => {
		initializeStreams();
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

<div class="matrix-container" style="color: {colorHex};">
	{#each streams as stream, i (i)}
		<div
			class="letter"
			class:big={stream.big}
			class:delay={stream.delay}
			style="left: {stream.left}%; top: -{stream.top}px;"
		></div>
	{/each}
</div>

<style>
	.matrix-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.letter {
		position: absolute;
		font-family: monospace;
		color: currentColor;
		text-shadow: 0 0 5px currentColor;
		animation: fall 5s linear infinite;
	}

	.letter::after {
		content: 'abcdefghijklmnopqrstuvwxyz0123456789';
		display: inline-block;
		writing-mode: vertical-rl;
		text-orientation: upright;
	}

	.big {
		font-size: 24px;
	}

	.big::after {
		content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	}

	.delay {
		animation-delay: 2.5s;
	}

	@keyframes fall {
		0% {
			transform: translateY(0) rotateY(0);
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			transform: translateY(110vh) rotateY(360deg);
			opacity: 0;
		}
	}
</style>
