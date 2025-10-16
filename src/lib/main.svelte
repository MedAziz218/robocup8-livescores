<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import { Switch } from '$lib/components/ui/switch';
	import { Input } from '$lib/components/ui/input';
	import { Menu, Settings, User, Moon, Sun } from 'lucide-svelte';
	import FlowEditor from '$lib/(components)/flow/flow-editor.svelte';

	// State using Svelte 5 runes
	let counter = $state(0);
	let sliderValue = $state([50]);
	let switchEnabled = $state(false);
	let inputValue = $state('');
	let isDarkMode = $state(false);
	
	// Functions to modify counter
	function incrementCounter() {
		counter++;
	}
	
	function decrementCounter() {
		counter--;
	}
	
	function resetCounter() {
		counter = 0;
	}

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<div class="flex h-screen flex-col bg-background">
	<!-- Top Bar -->
	<header class="flex h-16 items-center justify-between border-b border-border bg-card px-6">
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon">
				<Menu class="h-5 w-5" />
			</Button>
			<h1 class="text-xl font-semibold text-foreground">Application</h1>
		</div>
		
		<div class="flex items-center gap-2">
			<!-- Added dark mode toggle button -->
			<Button variant="ghost" size="icon" onclick={toggleDarkMode}>
				{#if isDarkMode}
					<Sun class="h-5 w-5" />
				{:else}
					<Moon class="h-5 w-5" />
				{/if}
			</Button>
			<Button variant="ghost" size="icon">
				<Settings class="h-5 w-5" />
			</Button>
			<Button variant="ghost" size="icon">
				<User class="h-5 w-5" />
			</Button>
		</div>
	</header>

	<!-- Main Content Area with Side Panel -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Main Content (80% width) -->
		<main class="flex-1 overflow-hidden bg-background p-6">
			<div class="h-full rounded-lg border border-border bg-card overflow-hidden">
				<FlowEditor />
			</div>
		</main>

		<!-- Right Side Panel (20% width) -->
		<aside class="w-[20%] border-l border-border bg-card p-6 overflow-auto">
			<h2 class="mb-6 text-lg font-semibold text-card-foreground">Controls</h2>
			
			<div class="space-y-6">
				<!-- Counter Display -->
				<div class="rounded-lg border border-border bg-primary/10 p-4">
					<h3 class="mb-2 text-sm font-medium text-foreground">Counter</h3>
					<p class="text-3xl font-bold text-primary">{counter}</p>
				</div>

				<!-- Input Control -->
				<div class="space-y-2">
					<Label for="text-input">Text Input</Label>
					<Input
						id="text-input"
						type="text"
						placeholder="Enter text..."
						bind:value={inputValue}
					/>
				</div>

				<!-- Slider Control -->
				<div class="space-y-2">
					<Label for="slider">Slider Value: {sliderValue[0]}</Label>
					<Slider
						id="slider"
						min={0}
						max={100}
						step={1}
						type="multiple"
						bind:value={sliderValue}
					/>
				</div>

				<!-- Switch Control -->
				<div class="flex items-center justify-between">
					<Label for="switch">Enable Feature</Label>
					<Switch id="switch" bind:checked={switchEnabled} />
				</div>

				<!-- Status Display -->
				<div class="rounded-lg border border-border bg-muted p-4">
					<h3 class="mb-2 text-sm font-medium text-foreground">Status</h3>
					<div class="space-y-1 text-xs text-muted-foreground">
						<p>Input: {inputValue || 'Empty'}</p>
						<p>Slider: {sliderValue[0]}</p>
						<p>Switch: {switchEnabled ? 'On' : 'Off'}</p>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="space-y-2">
					<Button class="w-full" variant="default" onclick={incrementCounter}>
						Increment (+1)
					</Button>
					<Button class="w-full" variant="outline" onclick={decrementCounter}>
						Decrement (-1)
					</Button>
					<Button class="w-full" variant="secondary" onclick={resetCounter}>
						Reset Counter
					</Button>
				</div>
			</div>
		</aside>
	</div>
</div>
