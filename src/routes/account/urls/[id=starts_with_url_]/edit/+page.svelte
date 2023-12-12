<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import URLInput from '$lib/components/URLInput.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<URLInput title="Edit {data.endpoint}" {data} {form} action_text="Update" />
