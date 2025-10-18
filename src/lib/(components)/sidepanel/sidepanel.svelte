<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select";
	import { FlowServices } from "$lib/stores/flow-state.svelte";


	let matchSize = $state<string>("2");
	let numberOfMatches = $state(4);
	let xPadding = $state(20);
	let yPadding = $state(0);
</script>

{#if !FlowServices.isFullScreen()}
<aside class="w-80 border-l border-border bg-card p-6 overflow-auto h-screen">
	<h2 class="mb-6 text-lg font-semibold text-card-foreground">Settings</h2>

	<div class="space-y-6">
		<!-- Match Size Setting -->
		<div class="space-y-2 w-full">
			<Label for="match-size">Match Size</Label>
			<Select bind:value={matchSize} type="single" >
				<SelectTrigger id="match-size" class="w-full">
					{matchSize}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="2">2</SelectItem>
					<SelectItem value="4">4</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<!-- Number of Matches Setting -->
		<div class="space-y-2">
			<Label for="num-matches">Number of Matches</Label>
			<Input
				id="num-matches"
				type="number"
				min="1"
				bind:value={numberOfMatches}
				class="w-full"
			/>
		</div>

		<!-- X Padding Setting -->
		<div class="space-y-2">
			<Label for="x-padding">X Padding (px)</Label>
			<Input
				id="x-padding"
				type="number"
				min="0"
				bind:value={xPadding}
				class="w-full"
			/>
		</div>

		<!-- Y Padding Setting -->
		<div class="space-y-2">
			<Label for="y-padding">Y Padding (px)</Label>
			<Input
				id="y-padding"
				type="number"
				min="0"
				bind:value={yPadding}
				class="w-full"
			/>
		</div>

		<!-- Added Organize and Clear buttons alongside Apply button -->
		<div class="pt-4 space-y-2">
			<Button class="w-full" variant="default" onclick={()=>{FlowServices.applySettings(Number(matchSize),numberOfMatches,xPadding,yPadding)}}>
				Apply
			</Button>
			<Button class="w-full" variant="outline" onclick={()=>{FlowServices.organize()}}>
				Organize
			</Button>
			<Button class="w-full" variant="outline" onclick={()=>{FlowServices.clearNodes()}}>
				Clear
			</Button>
		</div>
	</div>
</aside>
{/if}
