<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
</script>

<TheCard title="Delete">
  <span slot="title">Delete {data.url.endpoint}</span>
  <span slot="sub-title">Are you sure you want to delete this URL? This cannot be undone.</span>
  <form method="post" use:enhance>
    <input type="hidden" name="id" value={$page.params.id} />
    <Button type="submit" class="w-full block">Yes, Delete</Button>
  </form>
</TheCard>
