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
  let password_visible = false;
  let confirm_password_visible = false;
</script>

<TheCard title="Register">
  <span slot="title">Sign Up</span>
  <span slot="sub-title">
    If you already have an account then please
    <a href="/login" class="text-primary underline">log in.</a>
  </span>
  <form method="post" class="space-y-3" use:enhance>
    {#if form?.message}
      <Alert.Root slot="alert" variant="destructive" class="w-full">
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{form.message}</Alert.Description>
      </Alert.Root>
    {/if}
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
    <div>
      <Label for="password">Password</Label>
      <Input
        type={password_visible ? 'text' : 'password'}
        name="password"
        data-testid="password"
        id="password"
        value={form?.password ?? data.password}
        aria-invalid={form?.errors?.password ? 'true' : undefined}
      />
      {#if form?.errors?.password}
        <small class="text-primary italic">{form?.errors?.password}</small>
      {/if}
    </div>
    <div>
      <Label for="confirm_password">Confirm Password</Label>
      <Input
        type={confirm_password_visible ? 'text' : 'password'}
        name="confirm_password"
        data-testid="confirm_password"
        id="confirm_password"
        value={form?.confirm_password ?? data.confirm_password}
        aria-invalid={form?.errors?.confirm_password ? 'true' : undefined}
      />
      {#if form?.errors?.confirm_password}
        <small class="text-primary italic">{form?.errors?.confirm_password}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Sign Up</Button>
  </form>
</TheCard>
