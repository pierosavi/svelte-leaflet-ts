<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import L, { Layer, type Content } from 'leaflet';
	import type { Popup, PopupOptions } from 'leaflet';
	import type { ContextLLayer } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getLayer } = getContext<ContextLLayer>(L.Layer);

	export let events: string[] = [];
	export let options: PopupOptions = {};

	let popup: Popup | null = null;
	let element: ((source: Layer) => Content) | Content;

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!popup) {
			popup = L.popup(options);
			eventBridge = new EventBridge(popup, dispatch, events);
			getLayer().bindPopup(popup);
		}
		popup.setContent(element);
	}

	onDestroy(() => {
		eventBridge.unregister();
	});

	export function getPopup() {
		return popup;
	}
</script>

<div style="display: none;">
	<div bind:this={element}>
		<slot />
	</div>
</div>
