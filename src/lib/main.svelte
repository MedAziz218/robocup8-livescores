<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Menu, Settings, User, Moon, Sun } from "lucide-svelte";
	import FlowEditor from "$lib/(components)/flow/flow-editor.svelte";
	import SidePanel from "$lib/(components)/sidepanel/sidepanel.svelte";
	import { LightSwitch } from "$lib/(components)/common";
	import { FlowServices } from "$lib/stores/flow-state.svelte";

	// $effect(() => {
		// window.addEventListener("keydown", FlowServices.handleKeydown);
		// return () => window.removeEventListener("keydown", FlowServices.handleKeydown);
	// });
	
</script>

<div class="flex h-screen flex-col bg-background">
	<!-- Top Bar -->
	{#if !FlowServices.isFullScreen()}
		<header
			class="flex h-16 items-center justify-between border-b border-border bg-card px-6"
		>
			<div class="flex items-center gap-3">
				<Button variant="ghost" size="icon">
					<Menu class="h-5 w-5" />
				</Button>
				<h1 class="text-xl font-semibold text-foreground">
					Robocup 8.0
				</h1>
			</div>

			<div class="flex items-center gap-2">
				<!-- Added dark mode toggle button -->
				<LightSwitch />
				<Button variant="ghost" size="icon">
					<Settings class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="icon">
					<User class="h-5 w-5" />
				</Button>
			</div>
		</header>
	{/if}
	<!-- Main Content Area with Side Panel -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Main Content (80% width) -->
		<main class="flex-1 overflow-hidden bg-background">
			<div
				class="h-full rounded-lg border border-border bg-card overflow-hidden"
			>
				<FlowEditor />
			</div>
		</main>

		<!-- Right Side Panel (20% width) -->
		<SidePanel />
	</div>
</div>
