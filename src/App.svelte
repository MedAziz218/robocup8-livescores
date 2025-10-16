<script lang="ts">
  import "./app.css";
  import Main from "$lib/main.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { SvelteFlowProvider } from "@xyflow/svelte";
</script>

<ModeWatcher defaultMode={"dark"} />
<main>
  <SvelteFlowProvider>
    <Main />
  </SvelteFlowProvider>
</main>
