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

	import { Wrench, Presentation, Download } from "lucide-svelte";

	import TeamNamesDialog from "$lib/(components)/common/team-names-dialog.svelte";
	let openTeamNamesDialog = $state(false)
	let fileInput: HTMLInputElement;
</script>
<TeamNamesDialog bind:open={openTeamNamesDialog}/>
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

				<div class="space-y-4">
					<!-- Match Size Setting -->
					<div class="space-y-2 w-full">
						<Label for="match-size" class="text-sm font-medium">Match Size</Label>
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
							<Label for="num-teams" class="text-sm font-medium">Number of Teams</Label>
							<Input
								id="num-teams"
								type="number"
								min="1"
								bind:value={FlowState.numberOfTeams}
								class="w-full"
							/>
						</div>

						<div class="w-24 space-y-2">
							<Label for="num-teams-display" class="text-sm font-medium">Used</Label>
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

					<!-- Total Matches and Rounds -->
					<div class="flex gap-4 items-end">
						<div class="flex-1 space-y-2">
							<Label for="num-matches" class="text-sm font-medium">Total Matches</Label>
							<Input
								id="num-matches"
								type="number"
								bind:value={FlowState.numberOfTotlaMatches}
								class="w-full"
								disabled
							/>
						</div>
						<div class="flex-1 space-y-2">
							<Label for="num-rounds" class="text-sm font-medium">Rounds</Label>
							<Input
								id="num-rounds"
								type="number"
								bind:value={FlowState.numberOfRounds}
								class="w-full"
								disabled
							/>
						</div>
					</div>

					<!-- Initial Matches -->
					<div class="space-y-2">
						<Label for="initial-matches" class="text-sm font-medium">Initial Matches</Label>
						<Input
							id="initial-matches"
							type="number"
							bind:value={FlowState.numberOfInitialMatches}
							class="w-full"
							disabled
						/>
					</div>

					<!-- Width input added -->
					<div class="space-y-2">
						<Label for="width" class="text-sm font-medium">Width (px)</Label>
						<Input
							id="width"
							type="number"
							min="0"
							bind:value={FlowState.MatchNodewidth}
							class="w-full"
						/>
					</div>

					<!-- X and Y Padding now side by side -->
					<div class="flex gap-4 items-end">
						<div class="flex-1 space-y-2">
							<Label for="x-padding" class="text-sm font-medium">X Padding (px)</Label>
							<Input
								id="x-padding"
								type="number"
								min="0"
								bind:value={FlowState.xpadding}
								class="w-full"
							/>
						</div>

						<div class="flex-1 space-y-2">
							<Label for="y-padding" class="text-sm font-medium">Y Padding (px)</Label>
							<Input
								id="y-padding"
								type="number"
								min="0"
								bind:value={FlowState.ypadding}
								class="w-full"
							/>
						</div>
					</div>

					<!-- Action Buttons - renamed Apply to Generate, added Edit Teams -->
					<div class="pt-4 space-y-2">
						<Button
							class="w-full"
							variant="default"
							onclick={() => {
								FlowServices.applySettings();
							}}
						>
							Generate
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
								openTeamNamesDialog = true
							}}
						>
							Edit Teams
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

			<!-- Presenting Tab - added Save to JSON button -->
			<TabsContent value="presenting" class="space-y-6 mt-6">
				<h2 class="text-lg font-semibold text-card-foreground">
					Presentation Mode
				</h2>
				<div class="text-sm text-muted-foreground mb-6">
					<p>Configure presentation settings here.</p>
				</div>
				<Button
					class="w-full"
					variant="default"
					onclick={() => {
						// TODO: Implement save to JSON functionality

						FlowServices.saveToJson();
					}}
				>
					<Download class="w-4 h-4 mr-2" />
					Save to JSON
				</Button>
				<Button
					class="w-full"
					variant="default"
					onclick={() => {
						// TODO: Implement save to JSON functionality
						fileInput.click()
						
					}}
				>
					<Download class="w-4 h-4 mr-2" />
					Load from JSON
				</Button>

			<input bind:this={fileInput} style="display: none;" type="file" accept=".json" onchange={FlowServices.LoadFromJson} />

			</TabsContent>
		</Tabs>
	</aside>
{/if}
