<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { LatLngExpression, CircleMarkerOptions, Circle, CircleOptions } from 'leaflet';
	import type { ContextL, ContextLLayer } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let latLng: LatLngExpression;

	// This is pretty bad, options should be grouped into an object but still keep defaults
	export let radius: CircleOptions['radius'] = 10;
	export let color: CircleOptions['color'] = '#3388ff';
	export let weight: CircleOptions['weight'] = 3;
	export let opacity: CircleOptions['opacity'] = 1.0;
	export let lineCap: CircleOptions['lineCap'] = 'round';
	export let lineJoin: CircleOptions['lineJoin'] = 'round';
	export let dashArray: CircleOptions['dashArray'] = undefined;
	export let dashOffset: CircleOptions['dashOffset'] = undefined;
	export let fill: CircleOptions['fill'] = true;
	export let fillColor: CircleOptions['fillColor'] = '#3388ff';
	export let fillOpacity: CircleOptions['fillOpacity'] = 0.2;
	export let fillRule: CircleOptions['fillRule'] = 'evenodd';
	export let options: CircleMarkerOptions = {};
	export let events: string[] = [];

	let circle: Circle | null = null;

	setContext<ContextLLayer>(L.Layer, {
		getLayer: () => circle!
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!circle) {
			circle = L.circle(latLng, options).addTo(getMap());
			eventBridge = new EventBridge(circle, dispatch, events);
		}
		circle.setLatLng(latLng);
		if (radius) circle.setRadius(radius);
		circle.setStyle({
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
		circle?.removeFrom(getMap());
	});

	export function getCircle() {
		return circle;
	}
</script>

<div>
	{#if circle}
		<slot />
	{/if}
</div>
