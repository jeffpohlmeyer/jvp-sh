<script lang="ts">
  import { enhance } from '$app/forms';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<TheCard title="Deactivate Account">
  <span slot="title">Deactivate Account</span>
  <form method="post" use:enhance>
    <p>Are you sure you want to deactivate your account?</p>
    <Button type="submit" class="block w-full">Yes</Button>
  </form>
</TheCard>
