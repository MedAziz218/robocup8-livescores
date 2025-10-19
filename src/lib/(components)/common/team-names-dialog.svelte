<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	// import { Textarea } from '$lib/components/ui/textarea';
	import {FlowState,FlowServices} from '$lib/stores/flow-state.svelte'

	export interface Props {
		open?: boolean;
		onApply?: (teamNames: string) => void;
		onCancel?: () => void;
	}

	let { open = $bindable(false), onApply, onCancel }: Props = $props();
	let teamNamesText = $state('');
	let textareaElement: HTMLTextAreaElement | undefined = $state();

	function handleApply() {
		onApply?.(teamNamesText);
		teamNamesText = '';
		FlowServices.applyTeamNames();
		open = false;
	}

	function handleCancel() {
		onCancel?.();
		teamNamesText = '';
		open = false;
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			teamNamesText = '';
		}
	}
</script>

<Dialog.Root bind:open={open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-4xl max-h-[90vh] flex flex-col">
		<Dialog.Header>
			<Dialog.Title>Enter Team Names</Dialog.Title>
			<Dialog.Description>
				Enter each team name on a new line
			</Dialog.Description>
		</Dialog.Header>

		<div class="relative w-full flex-1 overflow-hidden">
			<div class="flex border rounded-md overflow-hidden bg-background dark:bg-[#1D1C18] h-full">
				<!-- Line numbers -->
				<div
					class="flex flex-col items-center justify-start bg-muted dark:bg-[#2a2925] text-muted-foreground dark:text-[#E1DBBD] text-sm font-mono px-3 py-2 select-none border-r dark:border-[#3a3930] overflow-y-auto pointer-events-none"
				>
					{#each Array(Math.max(teamNamesText.split('\n').length, 10)) as _, i}
						<div class="h-6 leading-6">{i + 1}</div>
					{/each}
				</div>

				<!-- Textarea -->
				<div class="flex-1 relative overflow-hidden">
					<textarea
						bind:this={textareaElement}
						bind:value={FlowState.teamNames}
						placeholder="Team 1&#10;Team 2&#10;Team 3..."
						class="w-full h-full p-2 font-mono text-sm resize-none bg-background dark:bg-[#1D1C18] text-foreground dark:text-[#E1DBBD] placeholder-muted-foreground dark:placeholder-[#8b8575] border-0 focus:outline-none focus:ring-0"
					></textarea>
				</div>
			</div>
		</div>

		<Dialog.Footer class="flex gap-2 justify-end">
			<Button variant="outline" onclick={handleCancel}>
				Cancel
			</Button>
			<Button
				class="bg-[#E2AC0D] hover:bg-[#d4a00d] text-black dark:bg-[#E2AC0D] dark:hover:bg-[#d4a00d] dark:text-black"
				onclick={handleApply}
			>
				Apply
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
