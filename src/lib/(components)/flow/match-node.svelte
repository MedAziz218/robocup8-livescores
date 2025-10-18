<script module>
  import type { Node, NodeProps } from "@xyflow/svelte";
  import { Handle, Position, useNodes } from "@xyflow/svelte";

  import type { TeamData } from "./team-component.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import {
    FlowState,
    FlowServices,
    FocusMatchAnimation,
    MatchServices,
  } from "$lib/stores/flow-state.svelte";

  import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
  } from "$lib/components/ui/context-menu";

  import { useSvelteFlow, type FitViewOptions } from "@xyflow/svelte";
  export type MatchNodeData = {
    round: number;
    matchID: number;
    matchSize: number;
    text: string;
    teamsData: TeamData[];
    MatchIsDone?: boolean;
    winnerteamID?: number;
    winnerNextMatchID?: string;
  };
  export type MatchNode = Node<MatchNodeData>;
</script>

<script lang="ts">
  import TeamComponent from "./team-component.svelte";
  import { useNodesData } from '@xyflow/svelte';
  const { updateNodeData, fitView,getNode } = useSvelteFlow();
  let { id: nodeID, data = $bindable()}: NodeProps<MatchNode> = $props();
 
  const nodeData = useNodesData([nodeID]);
   let {
    round,
    matchID,
    matchSize,
    teamsData,
    MatchIsDone,
    winnerteamID,
    winnerNextMatchID,
  } = $state(data);

  $effect(() => {
    // nodeData changes whenever the data of the passed node ids get updated
    if (nodeData.current[0].data){
      teamsData = nodeData.current[0].data.teamsData as TeamData[]
      winnerNextMatchID = nodeData.current[0].data.winnerNextMatchID as string
    }
  });

    $effect(() => {
    // nodeData changes whenever the data of the passed node ids get updated
    if (teamsData){
      updateNodeData(nodeID,{teamsData:teamsData})
    }
  });

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
      FlowServices.focusMatch(matchID);
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

        FlowServices.removeTeamFromMatch(winnerNextMatchID||'',selectedTeam,nodeID)
        

      } else if (selectedTeam.teamStatus != "eliminated") {
        teamsData.map((t) => {
          if (t.teamStatus != "eliminated") t.teamStatus = "loser";
        });
        let oldWinnerID = winnerteamID==-1 ? undefined :teamsData[winnerteamID].teamID ;
        winnerteamID = selectedTeamID;
        selectedTeam.teamStatus = "winner";

        // winnerNextMatchID = getNode(nodeID)?.data.winnerNextMatchID as string

        console.log(`winnerNextMatchID=${winnerNextMatchID}, ${nodeData.current[0].data.winnerNextMatchID}`)
        FlowServices.addTeamToMatch(winnerNextMatchID||'',selectedTeam,oldWinnerID,nodeID)
        
        

        teamsData[selectedTeamIndex] = selectedTeam;
      }
    }
  }
</script>

<div class="match-container">
  <div class="match-header">
    <span class="match-id">{`Match ${matchID}`}</span>
    <span class="match-size">{`R${round}`}</span>
  </div>

  {#if !isValidTeamsData}
    <div class="error-message">
      Invalid teams data: must have between 2 and {matchSize} teams
    </div>
  {:else}
    <div class="teams-list">
      {#each teamsData as team, index (team.id)}
        <ContextMenu>
          <ContextMenuTrigger>
            <TeamComponent
              id={team.id}
              teamID={team.teamID}
              teamName={team.teamName}
              bind:teamStatus={teamsData[index].teamStatus}
              universityAbbr={team.universityAbbr}
            />
            <ContextMenuContent>
              {#if team.teamID != -1}
                <ContextMenuItem
                  disabled={team.teamStatus == "eliminated"}
                  onclick={() =>
                    handleContextMenuAction("togglewinner", team.teamID, index)}
                >
                  {`${team.teamStatus == "winner" ? "Unset" : "Set"} [${team.teamID}] As Winner`}
                </ContextMenuItem>
              {/if}
              <ContextMenuItem
                onclick={() =>
                  handleContextMenuAction("Focus", team.teamID, index)}
              >
                Focus
              </ContextMenuItem>

              <ContextMenuSeparator></ContextMenuSeparator>
              <ContextMenuItem
                class="bg-destructive"
                disabled={team.teamStatus == "winner"}
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
