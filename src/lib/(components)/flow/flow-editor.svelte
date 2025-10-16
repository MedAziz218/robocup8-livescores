<script lang="ts">
	import { SvelteFlow, Background, Controls, MiniMap } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	let nodes = $state.raw([
		{
			id: '1',
			type: 'input',
			data: { label: 'Start Node' },
			position: { x: 250, y: 50 }
		},
		{
			id: '2',
			data: { label: 'Process Data' },
			position: { x: 250, y: 150 }
		},
		{
			id: '3',
			data: { label: 'Transform' },
			position: { x: 100, y: 250 }
		},
		{
			id: '4',
			data: { label: 'Validate' },
			position: { x: 400, y: 250 }
		},
		{
			id: '5',
			type: 'output',
			data: { label: 'End Node' },
			position: { x: 250, y: 350 }
		}
	]);

	let edges = $state.raw([
		{ id: 'e1-2', source: '1', target: '2', animated: true },
		{ id: 'e2-3', source: '2', target: '3' },
		{ id: 'e2-4', source: '2', target: '4' },
		{ id: 'e3-5', source: '3', target: '5' },
		{ id: 'e4-5', source: '4', target: '5' }
	]);
</script>

<div class="h-full w-full">
	<SvelteFlow {nodes} {edges} fitView>
		<Background />
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
		padding: 0.75rem;
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
