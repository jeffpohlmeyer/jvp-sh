<script lang="ts">
  import type { PageData } from './$types';
  import TheCard from '$lib/components/TheCard.svelte';

  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
</script>

<TheCard title="Delete Account">
  <span slot="title">Delete Account for {data.user.email}</span>
  <span slot="sub-title">
    This user's shortened links will remain in the system but the account will be disassociated with
    them.
  </span>
  <form method="post">
    <p>
      Are you sure you want to delete this account? This cannot be undone and all data will be lost.
    </p>
    <Button type="submit" class="block w-full">Yes</Button>
  </form>
</TheCard>
