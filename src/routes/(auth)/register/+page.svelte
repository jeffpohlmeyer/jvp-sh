<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  import Icon from '@iconify/svelte';

  import TheCard from '$lib/components/TheCard.svelte';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
  export let form: ActionData;
  let password_visible = false;
  $: password_icon = password_visible ? 'heroicons:eye-solid' : 'heroicons:eye-slash-solid';
  let confirm_password_visible = false;
  $: confirm_password_icon = confirm_password_visible
    ? 'heroicons:eye-solid'
    : 'heroicons:eye-slash-solid';
</script>

<TheCard title="Register">
  <span slot="title">Sign Up</span>
  <span slot="sub-title">
    If you already have an account then please
    <a href="/login" class="text-primary underline">log in.</a>
  </span>
  <form method="post" class="space-y-3" use:enhance>
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
      <div class="flex space-x-2">
        <Input
          type={password_visible ? 'text' : 'password'}
          name="password"
          id="password"
          value={data.password}
          class="grow"
          aria-invalid={form?.errors?.password ? 'true' : undefined}
        />
        <Button
          type="button"
          size="icon"
          class=""
          on:click={() => (password_visible = !password_visible)}
        >
          <Icon icon={password_icon} />
        </Button>
      </div>
      {#if form?.errors?.password}
        <small class="text-primary italic">{form?.errors?.password}</small>
      {/if}
    </div>
    <div>
      <Label for="confirm_password">Confirm Password</Label>
      <div class="flex space-x-2">
        <Input
          type={confirm_password_visible ? 'text' : 'password'}
          name="confirm_password"
          id="confirm_password"
          value={data.confirm_password}
          class="grow"
          aria-invalid={form?.errors?.confirm_password ? 'true' : undefined}
        />
        <Button
          type="button"
          size="icon"
          class=""
          on:click={() => (confirm_password_visible = !confirm_password_visible)}
        >
          <Icon icon={confirm_password_icon} />
        </Button>
      </div>
      {#if form?.errors?.confirm_password}
        <small class="text-primary italic">{form?.errors?.confirm_password}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Sign Up</Button>
  </form>
</TheCard>
