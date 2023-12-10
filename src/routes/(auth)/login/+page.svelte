<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';

  import Icon from '@iconify/svelte';

  import TheCard from '$lib/components/TheCard.svelte';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
  export let form: ActionData;
  let password_visible = false;

  $: icon = password_visible ? 'heroicons:eye-solid' : 'heroicons:eye-slash-solid';
</script>

<TheCard title="Log In">
  <span slot="title">Log In</span>
  <span slot="sub-title">
    If you have not created an account yet, then please
    <a href="/register" class="text-primary underline">sign up</a>
    first.
  </span>
  <form method="post" class="space-y-3" use:enhance>
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
          <Icon {icon} />
        </Button>
      </div>
      {#if form?.errors?.password}
        <small class="text-primary italic">{form.errors.password}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Log In</Button>
  </form>
  <a href="/forgot-password" class="text-primary underline pt-8 pb-2 block text-center">
    Forgot Password
  </a>
</TheCard>
