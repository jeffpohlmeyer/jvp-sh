<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  import TheCard from '$lib/components/TheCard.svelte';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import * as Alert from '$lib/components/ui/alert';

  export let data: PageData;
  export let form: ActionData;

  $: title =
    $page.url.searchParams.get('token-type') === 'activation'
      ? 'New Activation Token Request'
      : 'New Password Reset Request';
  $: short_title =
    $page.url.searchParams.get('token-type') === 'activation' ? 'Activation' : 'Password Reset';
</script>

<TheCard title={short_title}>
  <span slot="title">{title}</span>
  <span slot="sub-title">
    {#if $page.url.searchParams.get('token-type') === 'activation'}
      <p>Enter your email address below to request a new activation token.</p>
    {:else}
      <p>Enter your email address below to request a new password reset token.</p>
    {/if}
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
    <input
      type="hidden"
      id="token-type"
      name="token_type"
      value={form?.token_type ?? data.token_type}
    />

    <Button type="submit" class="w-full block">Request Token</Button>
  </form>
</TheCard>
