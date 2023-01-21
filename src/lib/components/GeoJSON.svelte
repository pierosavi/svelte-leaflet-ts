<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'leaflet';
	import type { GeoJsonObject } from 'geojson';
	import type { ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let data: GeoJsonObject | null = null;
	export let options = {};
	export let events: string[] = [];

	let geojson: GeoJSON | null = null;

	setContext(L.Layer, {
		getLayer: () => geojson
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!geojson) {
			geojson = L.geoJSON(undefined, options).addTo(getMap());
			eventBridge = new EventBridge(geojson, dispatch, events);
		}
		if (data) {
			geojson.clearLayers();
			geojson.addData(data);
		}
	}

	onDestroy(() => {
		eventBridge.unregister();
		geojson?.removeFrom(getMap());
	});

	export function getGeoJSON() {
		return geojson;
	}
</script>

<div>
	{#if geojson}
		<slot />
	{/if}
</div>
