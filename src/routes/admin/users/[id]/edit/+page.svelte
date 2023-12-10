<script lang="ts">
  import type { PageData } from './$types';
  import TheCard from '$lib/components/TheCard.svelte';

  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;

  let active = data.user.active;

  function handleCheckedChange() {
    active = !active;
  }
</script>

<TheCard title="Edit Account">
  <span slot="title">Edit Account for {data.user.email}</span>
  <form method="post" class="space-y-3">
    <div class="space-y-1 5">
      <Label>Set Active State</Label>
      <div class="flex items-center space-x-2">
        <Switch
          id="active"
          name="active"
          checked={data.user.active}
          onCheckedChange={handleCheckedChange}
        />
        <Label for="active">{active ? 'Active' : 'Not Active'}</Label>
      </div>
    </div>
    <Button type="submit" class="block w-full">Yes</Button>
  </form>
</TheCard>
