<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { Polygon, PathOptions, LatLngExpression, PolylineOptions } from 'leaflet';
	import type { ContextL, ContextLLayer } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let latLngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
	export let color = '#3388ff';
	export let weight = 3;
	export let opacity = 1.0;
	export let lineCap: PathOptions['lineCap'] = 'round';
	export let lineJoin: PathOptions['lineJoin'] = 'round';
	export let dashArray: PathOptions['dashArray'];
	export let dashOffset: PathOptions['dashOffset'];
	export let fill: PathOptions['fill'] = true;
	export let fillColor: PathOptions['fillColor'] = '#3388ff';
	export let fillOpacity: PathOptions['fillOpacity'] = 0.2;
	export let fillRule: PathOptions['fillRule'] = 'evenodd';
	export let options: PolylineOptions = {};
	export let events: string[] = [];

	let polygon: Polygon | null = null;

	setContext<ContextLLayer>(L.Layer, {
		getLayer: () => polygon!
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!polygon) {
			polygon = L.polygon(latLngs, options).addTo(getMap());
			eventBridge = new EventBridge(polygon, dispatch, events);
		}
		polygon.setLatLngs(latLngs);
		polygon.setStyle({
			color,
			weight,
			opacity,
			lineCap,
			lineJoin,
			dashArray,
			dashOffset,
			fill,
			fillColor,
			fillOpacity,
			fillRule
		});
	}

	onDestroy(() => {
		eventBridge.unregister();
		polygon?.removeFrom(getMap());
	});

	export function getPolygon() {
		return polygon;
	}
</script>

<div>
	{#if polygon}
		<slot />
	{/if}
</div>
