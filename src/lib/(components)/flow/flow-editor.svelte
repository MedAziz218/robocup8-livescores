<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		type ColorMode,
	} from "@xyflow/svelte";
	import { BackgroundVariant } from "@xyflow/svelte";
	import { mode } from "mode-watcher";
	import "@xyflow/svelte/dist/style.css";
	import { FlowState } from "$lib/stores/flow-state.svelte";

	import MatchNode from "./match-node.svelte";

	let colorMode = $derived<ColorMode>(mode.current ?? "dark");
	const bgColor = $derived(colorMode == "dark" ? "#1D1C18" : "#f7f5ef");
	let nodes = $derived(FlowState.nodes());
	let edges = $derived(FlowState.edges());

	const nodeTypes = {
		match: MatchNode,
	};
	const defaultEdgeOptions = {
		type: "step",
		markerEnd: "edge-circle",
	};
</script>

<div class="h-full w-full">
	<SvelteFlow
		{colorMode}
		bind:nodes
		bind:edges
		fitView={FlowState.fitViewEnabled}
		snapGrid={FlowState.snapToGrid}
		{defaultEdgeOptions}
		{nodeTypes}
		minZoom={0.1}
		maxZoom={2}
	>
		<Background {bgColor} variant={BackgroundVariant.Dots} />
		<Controls />
		<MiniMap />
	</SvelteFlow>
</div>

<style>
	:global(.svelte-flow) {
		background-color: hsl(var(--background));
	}

	:global(.svelte-flow__node) {
		background-color: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		color: hsl(var(--card-foreground));
		border-radius: 0.5rem;
		padding-inline: 0.15rem;
		padding-bottom: 1.25rem;
		font-size: 0.875rem;
	}

	:global(.svelte-flow__node.selected) {
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
	}

	:global(.svelte-flow__edge-path) {
		stroke: hsl(var(--primary));
	}

	:global(.svelte-flow__controls) {
		background-color: hsl(var(--card));
		border: 1px solid hsl(var(--border));
	}

	:global(.svelte-flow__controls button) {
		background-color: hsl(var(--background));
		border-bottom: 1px solid hsl(var(--border));
		color: hsl(var(--foreground));
	}

	:global(.svelte-flow__controls button:hover) {
		background-color: hsl(var(--accent));
	}

	:global(.svelte-flow__minimap) {
		background-color: hsl(var(--card));
		border: 1px solid hsl(var(--border));
	}
</style>
