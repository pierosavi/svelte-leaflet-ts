<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { CircleMarkerOptions as Opt, CircleMarker, LatLngExpression } from 'leaflet';
	import type { ContextLLayer, ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let latLng: LatLngExpression;
	export let radius: Opt['radius'] = 10;
	export let color: Opt['color'] = '#3388ff';
	export let weight: Opt['weight'] = 3;
	export let opacity: Opt['opacity'] = 1.0;
	export let lineCap: Opt['lineCap'] = 'round';
	export let lineJoin: Opt['lineJoin'] = 'round';
	export let dashArray: Opt['dashArray'] = undefined;
	export let dashOffset: Opt['dashOffset'] = undefined;
	export let fill: Opt['fill'] = true;
	export let fillColor: Opt['fillColor'] = '#3388ff';
	export let fillOpacity: Opt['fillOpacity'] = 0.2;
	export let fillRule: Opt['fillRule'] = 'evenodd';
	export let options = {};
	export let events: string[] = [];

	let circleMarker: CircleMarker | null = null;

	setContext<ContextLLayer>(L.Layer, {
		getLayer: () => circleMarker!
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!circleMarker) {
			circleMarker = L.circleMarker(latLng, options).addTo(getMap());
			eventBridge = new EventBridge(circleMarker, dispatch, events);
		}
		circleMarker.setLatLng(latLng);
		if (radius) circleMarker.setRadius(radius);
		circleMarker.setStyle({
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
		circleMarker?.removeFrom(getMap());
	});

	export function getCircleMarker() {
		return circleMarker;
	}
</script>

<div>
	{#if circleMarker}
		<slot />
	{/if}
</div>
