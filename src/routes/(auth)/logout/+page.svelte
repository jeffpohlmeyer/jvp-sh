<script lang="ts">
  import { enhance } from '$app/forms';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<TheCard title="Log Out">
  <span slot="title">Log out</span>
  <form method="post" use:enhance>
    <p>Are you sure you want to log out?</p>
    <Button type="submit" class="block w-full">Yes, log out</Button>
  </form>
</TheCard>
