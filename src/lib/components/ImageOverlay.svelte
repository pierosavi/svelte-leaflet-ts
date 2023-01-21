<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import L from 'leaflet';
	import type { ImageOverlay, ImageOverlayOptions } from 'leaflet';
	import type { ContextL } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getMap } = getContext<ContextL>(L);

	export let imageUrl: string;
	export let bounds: L.LatLngBoundsExpression;
	export let opacity: ImageOverlayOptions['opacity'] = 1.0;
	export let zIndex = 1;
	export let options: ImageOverlayOptions = {};
	export let events: string[] = [];

	let imageOverlay: ImageOverlay | null = null;

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!imageOverlay) {
			imageOverlay = L.imageOverlay(imageUrl, bounds, options).addTo(getMap());
			eventBridge = new EventBridge(imageOverlay, dispatch, events);
		}
		imageOverlay.setUrl(imageUrl);
		imageOverlay.setOpacity(opacity ?? 1);
		imageOverlay.setZIndex(zIndex);
	}

	onDestroy(() => {
		eventBridge.unregister();
		imageOverlay?.removeFrom(getMap());
	});

	export function getImageOverlay() {
		return imageOverlay;
	}
</script>
