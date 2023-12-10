<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  import TheCard from '$lib/components/TheCard.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
  export let form: ActionData;

  let active = data.active ?? form?.active ?? false;
  let is_admin = data.is_admin ?? form?.is_admin ?? false;

  function handleCheckedChange(entry: 'active' | 'is_admin') {
    switch (entry) {
      case 'active':
        active = !active;
        break;
      case 'is_admin':
        is_admin = !is_admin;
        break;
      default:
        break;
    }
  }
</script>

<TheCard title="Create New User">
  <span slot="title">Create New User</span>
  <form method="post" use:enhance class="space-y-3">
    <div>
      <Label for="email">Email</Label>
      <Input
        type="email"
        name="email"
        data-testid="email"
        id="email"
        value={form?.email ?? data.email}
        aria-invalid={form?.errors?.email ? 'true' : undefined}
      />
      {#if form?.errors?.email}
        <small class="text-primary italic">{form?.errors?.email}</small>
      {/if}
    </div>
    <div class="space-y-1">
      <Label>Active State</Label>
      <div class="flex space-x-2">
        <Switch
          id="active"
          name="active"
          checked={form?.active ?? data.active}
          onCheckedChange={() => handleCheckedChange('active')}
        />
        <Label for="active">{active ? 'Active' : 'Not Active'}</Label>
      </div>
    </div>
    <div class="space-y-1">
      <Label>Is Admin</Label>
      <div class="flex space-x-2">
        <Switch
          id="is_admin"
          name="is_admin"
          checked={form?.is_admin ?? data.is_admin}
          onCheckedChange={() => handleCheckedChange('is_admin')}
        />
        <Label for="is_admin">{is_admin ? 'Admin' : 'Not Admin'}</Label>
      </div>
    </div>
    <Button type="submit" class="block w-full">Create User</Button>
  </form>
</TheCard>
