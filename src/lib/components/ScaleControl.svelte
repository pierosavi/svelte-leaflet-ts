<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import L from 'leaflet';
	import type { ControlPosition, Control } from 'leaflet';
	import type { ContextL } from './ContextTypes';

	const { getMap } = getContext<ContextL>(L);

	export let position: ControlPosition = 'topright';
	export let options: Control.ScaleOptions = {};

	let scaleControl: Control | null = null;

	$: {
		if (!scaleControl) {
			scaleControl = L.control.scale(options).addTo(getMap());
		}
		scaleControl.setPosition(position);
	}

	onDestroy(() => {
		scaleControl!.remove();
	});

	export function getScaleControl() {
		return scaleControl;
	}
</script>
