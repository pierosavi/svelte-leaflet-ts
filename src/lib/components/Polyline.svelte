<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { Polyline, PolylineOptions, LatLngExpression } from 'leaflet';
	import type { ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let latLngs: LatLngExpression[] | LatLngExpression[][];
	export let color = '#3388ff';
	export let weight = 3;
	export let opacity = 1.0;
	export let lineCap: PolylineOptions['lineCap'] = 'round';
	export let lineJoin: PolylineOptions['lineJoin'] = 'round';
	export let dashArray: PolylineOptions['dashArray'];
	export let dashOffset: PolylineOptions['dashOffset'];
	export let options: PolylineOptions = {};
	export let events: string[] = [];

	let polyline: Polyline | null = null;

	setContext(L.Layer, {
		getLayer: () => polyline
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!polyline) {
			polyline = L.polyline(latLngs, options).addTo(getMap());
			eventBridge = new EventBridge(polyline, dispatch, events);
		}
		polyline.setLatLngs(latLngs);
		polyline.setStyle({
			color,
			weight,
			opacity,
			lineCap,
			lineJoin,
			dashArray,
			dashOffset
		});
	}

	onDestroy(() => {
		eventBridge.unregister();
		polyline?.removeFrom(getMap());
	});

	export function getPolyline() {
		return polyline;
	}
</script>

<div>
	{#if polyline}
		<slot />
	{/if}
</div>
