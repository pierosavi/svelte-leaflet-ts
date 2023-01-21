<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import L from 'leaflet';
	import type { TileLayer, TileLayerOptions, WMSOptions } from 'leaflet';
	import type { ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let url: string;
	/**
	 * options should be of type WMSOptions if wms is true
	 */
	export let wms = false;
	export let opacity = 1.0;
	export let zIndex = 1;
	export let options: TileLayerOptions | WMSOptions = {};
	export let events: string[] = [];

	let tileLayer: TileLayer | null = null;

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!tileLayer) {
			tileLayer = (!wms ? L.tileLayer(url, options) : L.tileLayer.wms(url, options)).addTo(
				getMap()
			);
			eventBridge = new EventBridge(tileLayer, dispatch, events);
		}
		tileLayer.setUrl(url);
		tileLayer.setOpacity(opacity);
		tileLayer.setZIndex(zIndex);
	}

	onDestroy(() => {
		eventBridge.unregister();
		tileLayer?.removeFrom(getMap());
	});

	export function getTileLayer() {
		return tileLayer;
	}
</script>
