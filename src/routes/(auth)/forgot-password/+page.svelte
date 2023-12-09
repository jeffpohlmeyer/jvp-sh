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

<TheCard title="Forgot Password">
  <span slot="title">Forgot Password</span>
  <span slot="sub-title">Please enter your email to reset your password.</span>
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
        id="email"
        value={form?.email ?? data.email}
        aria-invalid={form?.errors?.email ? 'true' : undefined}
      />
      {#if form?.errors?.email}
        <small class="text-primary italic">{form.errors.email}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Send</Button>
  </form>
</TheCard>
