<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import L from 'leaflet';
	import type { Map } from 'leaflet';

	import EventBridge from '../EventBridge';

	export let options = {};
	export let events: string[] = [];

	let map: Map | null = null;

	setContext(L, {
		getMap: () => map
	});

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	function initialize(container: HTMLDivElement) {
		map = L.map(container, options);
		eventBridge = new EventBridge(map, dispatch, events);
		return {
			destroy: () => {
				eventBridge.unregister();
				map!.remove();
			}
		};
	}

	export function getMap() {
		return map;
	}
</script>

<div style="height:100%; width:100%;" use:initialize>
	{#if map}
		<slot />
	{/if}
</div>
