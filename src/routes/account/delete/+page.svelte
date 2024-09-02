<script lang="ts">
  import { enhance } from '$app/forms';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<TheCard title="Delete Account">
  <span slot="title">Delete Account</span>
  <span slot="sub-title">
    Your shortened links will remain in the system but your account will be disassociated with them.
  </span>
  <form method="post" use:enhance>
    <p>
      Are you sure you want to delete your account? This cannot be undone and all data will be lost.
    </p>
    <Button type="submit" class="block w-full">Yes</Button>
  </form>
</TheCard>
