<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		type ColorMode,
		type Edge,
		type Node,
		ControlButton,
	} from "@xyflow/svelte";

	import {
		ScreenShare as FullScreenIcon,
		Focus as FocusMatchIcon,
		SkipForward as FocusNextMatchIcon,
		SkipBack as FocusPreviousMatchIcon,
	} from "lucide-svelte";

	import { BackgroundVariant } from "@xyflow/svelte";
	import { mode } from "mode-watcher";
	import "@xyflow/svelte/dist/style.css";
	import { FlowState, FlowServices } from "$lib/stores/flow-state.svelte";

	import MatchNode from "./match-node.svelte";

	import { type FitViewOptions, useSvelteFlow } from "@xyflow/svelte";

	const sv = useSvelteFlow();
	

	
	let colorMode = $derived<ColorMode>(mode.current ?? "dark");
	const bgColor = $derived(colorMode == "dark" ? "#1D1C18" : "#f7f5ef");

	const nodeTypes = {
		match: MatchNode,
	};
	const defaultEdgeOptions = {
		type: "step",
		markerEnd: "edge-circle",
	};

	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);
	export function setNodes  (newNodes:Node[]) : void {
		nodes = [...newNodes]
	}
	export function setEdges  (newEdges:Edge[]) : void {
		edges = [...newEdges]
	}

	$effect(() => {
		FlowServices.init(sv);
		FlowState.setNodes = setNodes
		FlowState.setEdges = setEdges

	});
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

		<Controls
			style="transition-duration:300ms;"
			showLock={false}
			showZoom={false}
			showFitView={false}
			class="opacity-10 transition-opacity hover:opacity-60"
		>
			<!-- class= "opacity-0 transition-opacity hover:opacity-60" -->
			<!-- <ControlButton onclick={() => console.log('⚡️')}>⚡️</ControlButton> -->
			<ControlButton
				onclick={() => {
					FlowServices.toggleFullScreen();
					setTimeout(FlowServices.fitWholeView, 1);
				}}><FullScreenIcon /></ControlButton
			>
			<ControlButton
				onclick={() => {
					FlowServices.focusPrevMatch();
				}}><FocusPreviousMatchIcon /></ControlButton
			>
			<!-- 
			<ControlButton
				onclick={() => {
					fitView({
						...$focusNodeAnimation,
						nodes: [{ id: $focusedNode.toString() }],
					});
				}}><FocusMatchIcon /></ControlButton
			>-->
			<ControlButton
				onclick={() => {
					FlowServices.focusNextMatch();
				}}><FocusNextMatchIcon /></ControlButton
			>
		</Controls>
		<MiniMap
			style="transition-duration:300ms;"
			class="opacity-0 transition-opacity hover:opacity-60"
		/>
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
