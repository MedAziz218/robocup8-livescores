<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Slider } from "$lib/components/ui/slider";
	import { Switch } from "$lib/components/ui/switch";
	import { FlowState } from "$lib/stores/flow-state.svelte";
	import { Input } from "$lib/components/ui/input";
	import TeamComponent from "../flow/team-component.svelte";
	// Local state for slider values (Slider component expects array)
	let animationSpeedValue = $derived([FlowState.animationSpeed * 100]);
	let nodeSpacingValue = $derived([FlowState.nodeSpacing]);
	let gridSizeValue = $derived([FlowState.gridSize]);


	function resetToDefaults() {
		FlowState.animationSpeed = 1;
		FlowState.showMinimap = true;
		FlowState.showControls = true;
		FlowState.fitViewEnabled = false;
		FlowState.nodeSpacing = 100;
		FlowState.edgeStyle = "default";
		FlowState.snapToGrid = [25, 25];
		FlowState.gridSize = 15;

		animationSpeedValue = [100];
		nodeSpacingValue = [100];
		gridSizeValue = [15];
	}
</script>

<aside class="w-[20%] border-l border-border bg-card p-6 overflow-auto">
	<h2 class="mb-6 text-lg font-semibold text-card-foreground">
		Flow Editor Controls
	</h2>
	<div class="space-y-6">
		Display Settings
		<div class="space-y-4">
			<h3 class="text-sm font-medium text-foreground">Display</h3>

			<div class="flex items-center justify-between">
				<Label for="minimap">Show Minimap</Label>
				<Switch id="minimap" bind:checked={FlowState.showMinimap} />
			</div>

			<div class="flex items-center justify-between">
				<Label for="controls">Show Controls</Label>
				<Switch id="controls" bind:checked={FlowState.showControls} />
			</div>

			<div class="flex items-center justify-between">
				<Label for="fitview">Auto Fit View</Label>
				<Switch id="fitview" bind:checked={FlowState.fitViewEnabled} />
			</div>
		</div>

		Animation Settings
		<div class="space-y-2">
			<Label for="animation"
				>Animation Speed: {Math.round(animationSpeedValue[0])}%</Label
			>
			<Slider
				id="animation"
				min={0}
				max={200}
				step={10}
				type="multiple"
				bind:value={animationSpeedValue}
			/>
		</div>

		Layout Settings
		<div class="space-y-4">
			<h3 class="text-sm font-medium text-foreground">Layout</h3>

			<div class="space-y-2">
				<Label for="spacing"
					>Node Spacing: {nodeSpacingValue[0]}px</Label
				>
				<Slider
					id="spacing"
					min={50}
					max={200}
					step={10}
					type="multiple"
					bind:value={nodeSpacingValue}
				/>
			</div>

			<div class="flex items-center justify-between">
				<Label for="snap">Snap to Grid</Label>
				<Input id="snap1" type="number" bind:value={FlowState.snapToGrid[0]} />
				<Input id="snap1" type="number" bind:value={FlowState.snapToGrid[1]} />

			</div>

			{#if FlowState.snapToGrid}
				<div class="space-y-2">
					<Label for="gridsize">Grid Size: {gridSizeValue[0]}px</Label
					>
					<Slider
						id="gridsize"
						min={5}
						max={50}
						step={5}
						type="multiple"
						bind:value={gridSizeValue}
					/>
				</div>
			{/if}
		</div>

		Status Display
		<div class="rounded-lg border border-border bg-muted p-4">
			<h3 class="mb-2 text-sm font-medium text-foreground">
				Current Settings
			</h3>
			<div class="space-y-1 text-xs text-muted-foreground">
				<p>Animation: {Math.round(FlowState.animationSpeed * 100)}%</p>
				<p>Spacing: {FlowState.nodeSpacing}px</p>
				<p>
					Grid: {FlowState.snapToGrid
						? `${FlowState.gridSize}px`
						: "Off"}
				</p>
				<p>Minimap: {FlowState.showMinimap ? "Visible" : "Hidden"}</p>
			</div>
		</div>

		Action Buttons
		<div class="space-y-2">
			<Button class="w-full" variant="outline" onclick={resetToDefaults}>
				Reset to Defaults
			</Button>
		</div>
	</div>
</aside>
