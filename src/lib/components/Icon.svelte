<script lang="ts">
	import { getContext } from 'svelte';
	import L from 'leaflet';
	import type { Marker, Icon, IconOptions } from 'leaflet';
	import type { ContextLMarker } from './ContextTypes';

	const { getMarker } = getContext<ContextLMarker>(L.Marker);

	export let options: IconOptions = {
		iconUrl: ''
	};

	let icon: Icon | null = null;

	$: {
		icon = L.icon(options);
		(getMarker() as Marker).setIcon(icon);
	}

	export function getIcon() {
		return icon;
	}
</script>
