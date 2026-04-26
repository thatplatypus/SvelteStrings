<script lang="ts">
	let { colorRgb }: { colorRgb: string } = $props();
</script>

<div class="aurora" style="--aurora-rgb: {colorRgb};">
	<div class="aurora-band band-1"></div>
	<div class="aurora-band band-2"></div>
	<div class="aurora-band band-3"></div>
	<div class="aurora-band band-4"></div>
</div>

<style>
	.aurora {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.aurora-band {
		position: absolute;
		width: 160%;
		left: -30%;
		filter: blur(40px);
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(var(--aurora-rgb), 0.15) 30%,
			rgba(var(--aurora-rgb), 0.25) 50%,
			rgba(var(--aurora-rgb), 0.15) 70%,
			transparent 100%
		);
	}

	.band-1 {
		top: 0%;
		height: 40%;
		transform: rotate(-3deg);
		animation: drift-1 16s ease-in-out infinite alternate;
	}

	.band-2 {
		top: 25%;
		height: 35%;
		transform: rotate(2deg);
		opacity: 0.7;
		animation: drift-2 20s ease-in-out infinite alternate;
	}

	.band-3 {
		top: 50%;
		height: 30%;
		transform: rotate(-1.5deg);
		opacity: 0.55;
		animation: drift-3 14s ease-in-out infinite alternate;
	}

	.band-4 {
		top: 70%;
		height: 25%;
		transform: rotate(1deg);
		opacity: 0.45;
		animation: drift-4 18s ease-in-out infinite alternate;
	}

	@keyframes drift-1 {
		from {
			transform: rotate(-3deg) translateY(0) translateX(0);
		}
		to {
			transform: rotate(-2deg) translateY(20px) translateX(30px);
		}
	}

	@keyframes drift-2 {
		from {
			transform: rotate(2deg) translateY(0) translateX(0);
		}
		to {
			transform: rotate(1deg) translateY(-15px) translateX(-20px);
		}
	}

	@keyframes drift-3 {
		from {
			transform: rotate(-1.5deg) translateY(0) translateX(0);
		}
		to {
			transform: rotate(-0.5deg) translateY(25px) translateX(15px);
		}
	}

	@keyframes drift-4 {
		from {
			transform: rotate(1deg) translateY(0) translateX(0);
		}
		to {
			transform: rotate(2deg) translateY(-10px) translateX(-25px);
		}
	}
</style>
