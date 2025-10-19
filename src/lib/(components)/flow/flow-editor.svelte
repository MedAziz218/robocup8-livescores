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
	import {
		type FitViewOptions,
		useSvelteFlow,
		useConnection,
	} from "@xyflow/svelte";
	const Rounds = $derived(
		[...Array(FlowState.numberOfRounds).keys()].map((i) => i + 1),
	);
	const sv = useSvelteFlow();
	const c = useConnection();

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
	export function setNodes(newNodes: Node[]): void {
		nodes = [...newNodes];
	}
	export function setEdges(newEdges: Edge[]): void {
		edges = [...newEdges];
	}

	$effect(() => {
		FlowServices.init(sv, c);
		FlowServices.setNodes = setNodes;
		FlowServices.setEdges = setEdges;
	});

	$effect(() => {
		if (nodes.length ){
			localStorage.setItem("nodes", JSON.stringify($state.snapshot(nodes)));
		}
		if (edges.length){
			localStorage.setItem("edges", JSON.stringify($state.snapshot(edges)));
		}
	});

	$effect(() => {
		if (FlowState.fitViewEnabled){
			localStorage.setItem("FlowState", JSON.stringify($state.snapshot(FlowState))); 
		}
	});
	let hasLoaded = $state(false);
	$effect(() => {
		if (!hasLoaded) {
			nodes = JSON.parse(localStorage.getItem("nodes")||'[]');
			edges = JSON.parse(localStorage.getItem("edges")||'[]');
			

			hasLoaded = true;
		}
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
		<div
			class="svelte-flow__panel svelte-flow__attribution top right mr-2 mt-2
			 opacity-10 transition-opacity hover:opacity-60 x-4 py-2 text-base text-black"
		>
			<select
				bind:value={FlowState.startRound}
				onchange={() => {
					FlowServices.organize();
					FlowServices.fitWholeView();
				}}
			>
				{#each Rounds as round}
					<option value={round}>start round {round}</option>
				{/each}
			</select>
		</div>
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
		padding-bottom: 1.25rem;
		font-size: 0.875rem;
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
