<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

   export interface Props {
		isOpen: boolean;
		teamID: number;
		teamName: string;
	}

	let { isOpen = $bindable(false),teamName = $bindable(), teamID = $bindable()}: Props = $props();

  
</script>

<Dialog bind:open={isOpen}>
  <DialogTrigger>
    <Button variant="ghost">Enter Team Info</Button>
  </DialogTrigger>

  <DialogContent class="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle>Team Details</DialogTitle>
    </DialogHeader>

    <div class="flex flex-col gap-3 mt-2">
      <Input placeholder="Team Name" bind:value={teamName} />
      <Input placeholder="Team ID" bind:value={teamID} />
    </div>

    <DialogFooter class="mt-4">
      <Button onclick={()=>{}}>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
