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
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import { FlowServices, FlowState } from "$lib/stores/flow-state.svelte";

	import { Wrench, Presentation } from "lucide-svelte";
</script>

{#if !FlowServices.isFullScreen()}
	<aside
		class="w-80 border-l border-border bg-card p-6 overflow-auto h-screen"
	>
		<!-- Converted to tabbed interface with Builder and Presenting tabs -->
		<Tabs bind:value={FlowState.sidePanelTabValue} class="w-full">
			<TabsList class="grid w-full grid-cols-2">
				<TabsTrigger value="builder" class="flex items-center gap-2">
					<Wrench class="w-4 h-4" />
					Builder
				</TabsTrigger>
				<TabsTrigger value="presenting" class="flex items-center gap-2">
					<Presentation class="w-4 h-4" />
					Presenting
				</TabsTrigger>
			</TabsList>

			<!-- Builder Tab - Current Settings -->
			<TabsContent value="builder" class="space-y-6 mt-6">
				<h2 class="text-lg font-semibold text-card-foreground">
					Settings
				</h2>

				<div class="space-y-6">
					<!-- Match Size Setting -->
					<div class="space-y-2 w-full">
						<Label for="match-size">Match Size</Label>
						<Select bind:value={FlowState.matchSize} type="single">
							<SelectTrigger id="match-size" class="w-full">
								{FlowState.matchSize}
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="4">4</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<!-- Number of Matches Setting -->
					<div class="flex gap-4 items-end">
						<div class="flex-1 space-y-2">
							<Label for="num-teams">Number of Teams</Label>
							<Input
								id="num-teams"
								type="number"
								min="1"
								bind:value={FlowState.numberOfTeams}
								class="w-full"
							/>
						</div>

						<div class="w-24 space-y-2">
							<Label for="num-teams-display">Used</Label>
							<Input
								id="num-teams-display"
								type="number"
								min="1"
								bind:value={FlowState.numberOfTeamsUsed}
								disabled
								class="w-full"
							/>
						</div>
					</div>
					<div class="flex gap-4 items-end">
						<div class="space-y-2">
							<Label for="num-matches">Total Number of Matches</Label>
							<Input
								id="num-matches"
								type="number"
								bind:value={FlowState.numberOfTotlaMatches}
								class="w-full"
								disabled
							/>
						</div>
						<div class="space-y-2">
							<Label for="num-matches">Number of Round</Label>
							<Input
								id="num-matches"
								type="number"
								bind:value={FlowState.numberOfRounds}
								class="w-full"
								disabled
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="num-matches">Initial Number of Matches</Label>
						<Input
							id="num-matches"
							type="number"
							bind:value={FlowState.numberOfInitialMatches}
							class="w-full"
							disabled
						/>
					</div>

					<!-- X Padding Setting -->
					<div class="space-y-2">
						<Label for="x-padding">X Padding (px)</Label>
						<Input
							id="x-padding"
							type="number"
							min="0"
							bind:value={FlowState.xpadding}
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
							bind:value={FlowState.ypadding}
							class="w-full"
						/>
					</div>

					<!-- Action Buttons -->
					<div class="pt-4 space-y-2">
						<Button
							class="w-full"
							variant="default"
							onclick={() => {
								FlowServices.applySettings();
							}}
						>
							Apply
						</Button>
						<Button
							class="w-full"
							variant="outline"
							onclick={() => {
								FlowServices.organize();
							}}
						>
							Organize
						</Button>
						<Button
							class="w-full"
							variant="outline"
							onclick={() => {
								FlowServices.clearNodes();
							}}
						>
							Clear
						</Button>
					</div>
				</div>
			</TabsContent>

			<!-- Presenting Tab - Placeholder -->
			<TabsContent value="presenting" class="space-y-6 mt-6">
				<h2 class="text-lg font-semibold text-card-foreground">
					Presentation Mode
				</h2>
				<div class="text-sm text-muted-foreground">
					<p>Configure presentation settings here.</p>
				</div>
			</TabsContent>
		</Tabs>
	</aside>
{/if}
