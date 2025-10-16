<script lang="ts">
  import './app.css';
  import Main from '$lib/main.svelte';
  import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher defaultMode={'dark'} />
<main>
  <Main/>
</main>

