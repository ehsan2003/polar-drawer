<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { applyScale, polar2XY } from './main';
	let container: HTMLDivElement;
	let equationText = '0';
	export let size = {
		x: 1000,
		y: 500
	};
	let step = 0.01;
	let scale = 100;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let domain = { start: 0, end: Math.PI * 2 };
	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, size.x, size.y);
	});
	$: if (container) {
		size.x = container.clientWidth;
		size.y = size.x / 2;
	}
	$: if (ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, size.x, size.y);

		drawAxes();

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;

		if (isEquationTextValid()) {
			let isBroken = false;
			for (let theta = domain.start; theta < domain.end; theta += step) {
				try {
					const coordinates = polar2XY({
						theta,
						r: ((t: number) => eval(equationText))(theta)
					});
					const { x, y } = applyScale(scale)(coordinates);
					console.log(x, y);
					if (isBroken) {
						ctx.moveTo(x + size.x / 2, -y + size.y / 2);
						isBroken = false;
					} else {
						ctx.lineTo(x + size.x / 2, -y + size.y / 2);
					}
				} catch {
					isBroken = true;
				}
			}
		} else {
			console.log('equation is not valid');
		}

		ctx.stroke();
		function isEquationTextValid() {
			try {
				const t = 0;
				eval(equationText);
				return true;
			} catch {
				return false;
			}
		}
	}

	function drawAxes() {
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#888';
		ctx.moveTo(size.x / 2, 0);
		ctx.lineWidth = 1;
		ctx.lineTo(size.x / 2, size.y);
		ctx.moveTo(0, size.y / 2);
		ctx.lineTo(size.x, size.y / 2);
		ctx.stroke();
	}
</script>

<div class="container mx-auto px-4">
	<div class="" bind:this={container}>
		<canvas
			class="bg-white border-black border-solid shadow-xl"
			width={size.x}
			bind:this={canvas}
			height={size.y}
		/>
		<br />
		<div class="form-control">
			<label class="input-group">
				<span>Start </span>
				<input class="" type="number" bind:value={domain.start} />
			</label>
			<label class="input-group">
				<span>End </span>
				<input class="" type="number" bind:value={domain.end} />
			</label>
		</div>

		<br />
		<div class="form-control">
			<label class="input-group">
				<span>Equation : r = </span>
				<input class="" type="text" min="1" max="1000" step="1" bind:value={equationText} />
			</label>
		</div>

		<br />
		<div class="form-control">
			<label class="input-group">
				<span>Scale</span>
				<input class="range range-sm" type="range" min="1" max="1000" step="1" bind:value={scale} />
			</label>
		</div>
		<br />
		<div class="form-control">
			<label class="input-group">
				<span>Step</span>
				<input
					class="range range-sm"
					type="range"
					min="0.001"
					max="0.2"
					step="0.0001"
					bind:value={step}
				/>
			</label>
		</div>
	</div>
</div>
