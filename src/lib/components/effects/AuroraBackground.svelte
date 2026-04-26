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
		width: 140%;
		left: -20%;
		background: linear-gradient(
			180deg,
			transparent,
			rgba(var(--aurora-rgb), 0.06),
			transparent
		);
	}

	.band-1 {
		top: 5%;
		height: 30%;
		transform: rotate(-3deg);
		animation: drift-1 16s ease-in-out infinite alternate;
	}

	.band-2 {
		top: 30%;
		height: 25%;
		transform: rotate(2deg);
		opacity: 0.7;
		animation: drift-2 20s ease-in-out infinite alternate;
	}

	.band-3 {
		top: 55%;
		height: 22%;
		transform: rotate(-1.5deg);
		opacity: 0.5;
		animation: drift-3 14s ease-in-out infinite alternate;
	}

	.band-4 {
		top: 75%;
		height: 18%;
		transform: rotate(1deg);
		opacity: 0.4;
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
