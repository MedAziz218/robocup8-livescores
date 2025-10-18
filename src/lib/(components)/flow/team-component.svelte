<script module>
  interface TeamData {
    id: string,
    teamID: number;
    teamName: string;
    teamStatus?: "winner" | "loser" | "eliminated" | undefined;
    universityAbbr?: string;
    isBlank?: boolean;
  }
  export type { TeamData };
</script>

<script lang="ts">
  let {
    id,
    teamID,
    teamName,
    teamStatus = $bindable(undefined),
    universityAbbr = "",
  }: TeamData = $props();
</script>

<div
  class="flex items-center transition-colors duration-200 ease-in-out
           hover:bg-gray-100 dark:hover:bg-gray-700"
  class:winner={teamStatus === "winner"}
  class:loser={teamStatus === "loser"}
  class:eliminated={teamStatus === "eliminated"}

>
  <div
    class="flex h-[100%] w-[25px] items-center justify-center border-r
             border-gray-300 bg-gray-200 py-1
           font-semibold text-gray-700
             dark:border-gray-600 dark:bg-[#E2AC0D]"
  >
    {teamID>0 ? teamID : '-'}
  </div>
  <div
    class="w-full truncate bg-white py-1 pl-1 text-left text-gray-800
             hover:bg-gray-100 dark:bg-[#E1DBBD]
             dark:hover:bg-gray-300"
  >
    {#if teamStatus === "winner"}
      <span class="font-bold">🏆 {teamName}</span>
    {:else if teamStatus === "loser"}
      <span class="line-through">{teamName}</span>
    {:else if teamStatus === "eliminated"}
      <span class="line-through decoration-red-600 decoration-4 "
        >{teamName}</span
      >
    {:else}
      {teamName}
    {/if}
  </div>
</div>

<style>
  .winner {
    background-color: rgba(154, 230, 180, 0.3);
    border-left: 4px solid #48bb78;
  }

  .winner:hover {
    background-color: rgba(154, 230, 180, 0.5) !important;
  }

  .loser ,.eliminated {
    opacity: 0.6;
    background-color: rgba(254, 178, 178, 0.1);
  }

  .loser:hover {
    background-color: rgba(254, 178, 178, 0.2) !important;
  }

  :global(.dark) .winner {
    background-color: rgba(74, 222, 128, 0.1);
    border-left: 4px solid #22c55e;
  }

  :global(.dark) .winner:hover {
    background-color: rgba(74, 222, 128, 0.2) !important;
  }

  :global(.dark) .loser {
    opacity: 0.6;
    background-color: rgba(248, 113, 113, 0.1);
  }

  :global(.dark) .loser:hover {
    background-color: rgba(248, 113, 113, 0.2) !important;
  }
</style>
