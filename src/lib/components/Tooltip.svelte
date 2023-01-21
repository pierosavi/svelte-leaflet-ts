<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import L, { Layer, type Content } from 'leaflet';
	import type { Tooltip, TooltipOptions } from 'leaflet';
	import type { ContextLLayer } from './ContextTypes';

	import EventBridge from '../EventBridge';

	const { getLayer } = getContext<ContextLLayer>(L.Layer);

	export let events: string[] = [];
	export let options: TooltipOptions = {};

	let tooltip: Tooltip | null = null;
	let element: ((source: Layer) => Content) | Content;

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge;

	$: {
		if (!tooltip) {
			tooltip = L.tooltip(options);
			eventBridge = new EventBridge(tooltip, dispatch, events);
			getLayer().bindTooltip(tooltip);
		}
		tooltip.setContent(element);
	}

	onDestroy(() => {
		eventBridge.unregister();
	});

	export function getTooltip() {
		return tooltip;
	}
</script>

<div style="display: none;">
	<div bind:this={element}>
		<slot />
	</div>
</div>
