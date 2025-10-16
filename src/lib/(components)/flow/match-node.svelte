<script module>
  import type { Node, NodeProps } from "@xyflow/svelte";
  import { Handle, Position } from "@xyflow/svelte";

  import type { TeamData } from "./team-component.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { FlowState } from "$lib/stores/flow-state.svelte";
  import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
  } from "$lib/components/ui/context-menu";
  import { useSvelteFlow } from "@xyflow/svelte";
  export type MatchNode = Node<{
    matchID: number;
    matchSize: number;
    text: string;
    teamsData: TeamData[];
    MatchIsDone?: boolean;
    winnerteamID?: number;
  }>;
</script>

<script lang="ts">
  import TeamComponent from "./team-component.svelte";
  const { updateNodeData } = useSvelteFlow();
  let { id, data }: NodeProps<MatchNode> = $props();

  let { matchID, matchSize, teamsData, MatchIsDone, winnerteamID } =
    $state(data);
  // Validate teamsData length
  const isValidTeamsData = $derived(
    teamsData.length >= 2 && teamsData.length <= matchSize,
  );

  function handleContextMenuAction(
    action: string,
    selectedTeamID: number,
    selectedTeamIndex: number,
  ) {
    action = action.toLowerCase();
    const selectedTeam = teamsData[selectedTeamIndex];
    winnerteamID = teamsData.findIndex((t) => t.teamStatus == "winner");

    console.log(
      `Action: ${action}, Team ID: ${selectedTeamID} , check selected team: ${selectedTeam.teamID}`,
    );
    if (action.toLowerCase() === "focus") {
      // FIXME:
      // triggerFocusNodeAnimation = true;
    }
    if (action.toLowerCase() === "toggleeliminate") {
      if (
        selectedTeam.teamStatus == undefined ||
        selectedTeam.teamStatus == "loser"
      ) {
        selectedTeam.teamStatus = "eliminated";
        teamsData[selectedTeamIndex] = selectedTeam;
      } else if (selectedTeam.teamStatus == "eliminated") {
        if (winnerteamID == -1) selectedTeam.teamStatus = undefined;
        else selectedTeam.teamStatus = "loser";

        teamsData[selectedTeamIndex] = selectedTeam;
      }
    }
    if (action.toLowerCase() === "togglewinner") {
      // check if teamID is currently already set to winner or no
      if (selectedTeam.teamStatus == "winner") {
        winnerteamID = -1;
        teamsData.map((t) => {
          if (t.teamStatus != "eliminated") t.teamStatus = undefined;
        });
      } else if (selectedTeam.teamStatus != "eliminated") {
        teamsData.map((t) => {
          if (t.teamStatus != "eliminated") t.teamStatus = "loser";
        });

        winnerteamID = selectedTeamID;
        selectedTeam.teamStatus = "winner";
        teamsData[selectedTeamIndex] = selectedTeam;
      }
    }
  }
</script>

<div class="match-container">
  <div class="match-header">
    <span class="match-id">Match #{matchID}</span>
    <!-- <span class="match-size">{teamsData.length}/{matchSize}</span> -->
  </div>

  {#if !isValidTeamsData}
    <div class="error-message">
      Invalid teams data: must have between 2 and {matchSize} teamsgg
    </div>
  {:else}
    <div class="teams-list">
      {#each teamsData as team, index (team.teamID)}
        <ContextMenu>
          <ContextMenuTrigger>
            <TeamComponent
              teamID={team.teamID}
              teamName={team.teamName}
              bind:teamStatus={teamsData[index].teamStatus}
              universityAbbr={team.universityAbbr}
            />
            <ContextMenuContent>
              <ContextMenuItem
                disabled={team.teamStatus=="eliminated"}
                onclick={() =>
                  handleContextMenuAction("togglewinner", team.teamID, index)}
              >
                {`${team.teamStatus == "winner" ? "Unset" : "Set"} [${team.teamID}] As Winner`}
              </ContextMenuItem>
              <ContextMenuItem
                onclick={() =>
                  handleContextMenuAction("Focus", team.teamID, index)}
              >
                Focus
              </ContextMenuItem>
              <ContextMenuSeparator></ContextMenuSeparator>
              <ContextMenuItem
                class="bg-destructive"
                disabled={team.teamStatus=="winner"}
                onclick={() =>
                  handleContextMenuAction(
                    "toggleeliminate",
                    team.teamID,
                    index,
                  )}
              >
                ToggleEliminate
              </ContextMenuItem>

              <ContextMenuSeparator></ContextMenuSeparator>
            </ContextMenuContent>
            {#if index < matchSize}
              <Separator />
            {/if}
          </ContextMenuTrigger>
        </ContextMenu>
      {/each}
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Left}></Handle>
    </div>
  {/if}
</div>

<style>
  .match-container {
    background: hsl(var(--card));
    /* border: 2px solid hsl(var(--border)); */
    /* border-radius: 12px; */
    padding: 0px;
    min-width: 320px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 16px; */
    /* padding-bottom: 12px; */
    /* border-bottom: 1px solid hsl(var(--border)); */
  }

  .match-id {
    font-size: 16px;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .teams-list {
    display: flex;
    flex-direction: column;
  }

  .error-message {
    color: hsl(var(--destructive));
    font-size: 14px;
    padding: 12px;
    background: hsl(var(--destructive) / 0.1);
    border-radius: 8px;
    text-align: center;
  }
</style>
