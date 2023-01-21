<script lang="ts">
	import { getContext } from 'svelte';
	import L from 'leaflet';
	import type { DivIconOptions, DivIcon } from 'leaflet';
	import type { ContextLMarker } from './ContextTypes';

	const { getMarker } = getContext<ContextLMarker>(L.Marker);

	export let options: DivIconOptions = {};

	let icon: DivIcon | null = null;
	let html: DivIconOptions['html'] = undefined;

	$: {
		if (!icon) {
			icon = L.divIcon({ ...{ html }, ...options });
		} else {
			getMarker().setIcon(icon);
		}
	}

	export function getIcon() {
		return icon;
	}
</script>

<div bind:this={html}>
	<slot />
</div>
