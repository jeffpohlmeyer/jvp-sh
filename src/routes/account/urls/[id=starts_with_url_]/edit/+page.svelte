<script lang="ts">
  import type { ActionData, PageData } from './$types';

  import URLInput from '$lib/components/URLInput.svelte';

  export let data: PageData;
</script>

<URLInput title="Edit {data.url.endpoint}" {data} action_text="Update" />
