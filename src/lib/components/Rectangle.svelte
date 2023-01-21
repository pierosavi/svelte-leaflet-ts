<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { Rectangle, PathOptions, LatLngBoundsExpression } from 'leaflet';
	import type { ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let latLngBounds: LatLngBoundsExpression;
	export let color = '#3388ff';
	export let weight = 3;
	export let opacity = 1.0;
	export let lineCap: PathOptions['lineCap'] = 'round';
	export let lineJoin: PathOptions['lineJoin'] = 'round';
	export let dashArray: PathOptions['dashArray'];
	export let dashOffset: PathOptions['dashOffset'];
	export let fill = true;
	export let fillColor = '#3388ff';
	export let fillOpacity = 0.2;
	export let fillRule: PathOptions['fillRule'] = 'evenodd';
	export let options: PathOptions = {};
	export let events: string[] = [];

	let rectangle: Rectangle | null = null;

	setContext(L.Layer, {
		getLayer: () => rectangle
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!rectangle) {
			rectangle = L.rectangle(latLngBounds, options).addTo(getMap());
			eventBridge = new EventBridge(rectangle, dispatch, events);
		}
		rectangle.setBounds(latLngBounds);
		rectangle.setStyle({
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
		rectangle?.removeFrom(getMap());
	});

	export function getRectangle() {
		return rectangle;
	}
</script>

<div>
	{#if rectangle}
		<slot />
	{/if}
</div>
