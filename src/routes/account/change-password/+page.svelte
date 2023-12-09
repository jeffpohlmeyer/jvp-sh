<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import * as Alert from '$lib/components/ui/alert';

  export let data: PageData;
  export let form: ActionData;
</script>

<TheCard title="Change Password">
  <span slot="title">Change Password</span>
  <span slot="sub-title">
    Please enter your current password as well as your choice for your new password.
  </span>
  <form method="post" class="space-y-3" use:enhance>
    {#if form?.message}
      <Alert.Root slot="alert" variant="destructive" class="w-full">
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{form.message}</Alert.Description>
      </Alert.Root>
    {/if}
    <div>
      <Label for="current_password">Current Password</Label>
      <Input
        type="password"
        name="current_password"
        id="current_password"
        value={form?.current_password ?? data.current_password}
        aria-invalid={form?.errors?.current_password ? 'true' : undefined}
      />
      {#if form?.errors?.current_password}
        <small class="text-primary italic">{form.errors.current_password}</small>
      {/if}
    </div>
    <div>
      <Label for="password">New Password</Label>
      <Input
        type="password"
        name="password"
        id="password"
        value={form?.password ?? data.password}
        aria-invalid={form?.errors?.password ? 'true' : undefined}
      />
      {#if form?.errors?.password}
        <small class="text-primary italic">{form.errors.password}</small>
      {/if}
    </div>
    <div>
      <Label for="confirm_password">Confirm Password</Label>
      <Input
        type="password"
        name="confirm_password"
        id="confirm_password"
        value={form?.confirm_password ?? data.confirm_password}
        aria-invalid={form?.errors?.confirm_password ? 'true' : undefined}
      />
      {#if form?.errors?.confirm_password}
        <small class="text-primary italic">{form.errors.confirm_password}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Submit</Button>
  </form>
</TheCard>
