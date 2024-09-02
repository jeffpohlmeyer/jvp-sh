<script lang="ts">
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import { superForm } from 'sveltekit-superforms/client';
  import { Eye, EyeOff } from 'lucide-svelte';

  import type { PageData } from './$types';
  import { schema } from './utils';

  import { afterNavigate } from '$app/navigation';
  import TheCard from '$lib/components/TheCard.svelte';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let data: PageData;
  let loading = false;
  let password_visible = false;
  let confirm_password_visible = false;
  const form = superForm(data.form, {
    validators: valibotClient(schema),
    onSubmit: () => {
      loading = true;
    },
    onResult: () => {
      loading = false;
    }
  });
  const { form: formData, enhance, errors, message } = form;

  afterNavigate(() => {
    const to_focus: HTMLElement | null = document.querySelector('.focus-me');
    to_focus?.focus();
  });
</script>

<TheCard title="Reset Password">
  <span slot="title">Reset Password</span>
  <span slot="sub-title"> Please update your password with a new value here. </span>
  {#if $message}
    <Alert.Root
      class={$message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
    >
      {#if $message.title}
        <Alert.Title>
          {$message.title}
        </Alert.Title>
      {/if}
      <Alert.Description>
        {$message.text}
      </Alert.Description>
    </Alert.Root>
  {/if}
  <form use:enhance method="POST" class="space-y-2">
    <Form.Field {form} name="password" class="space-y-0 pb-2">
      <Form.Control let:attrs>
        <Label>Password</Label>
        <div class="relative">
          <Input
            {...attrs}
            variant={$errors.password ? 'error' : 'default'}
            required={!!attrs['aria-required'] || undefined}
            type={password_visible ? 'text' : 'password'}
            class="focus-me"
            bind:value={$formData.password}
          />
          <Button
            size="icon"
            variant="ghost"
            type="button"
            class="absolute inset-y-0 right-0"
            tabindex={-1}
            on:click={() => (password_visible = !password_visible)}
          >
            {#if password_visible}
              <Eye />
            {:else}
              <EyeOff />
            {/if}
          </Button>
        </div>
      </Form.Control>
      <Form.FieldErrors let:errors let:errorAttrs>
        {#if errors.length}
          <div class="my-1 rounded-md bg-red-100 px-2 py-1 italic text-red-800" {...errorAttrs}>
            {errors[0]}
          </div>
        {/if}
      </Form.FieldErrors>
    </Form.Field>
    <Form.Field {form} name="confirm_password" class="space-y-0 pb-2">
      <Form.Control let:attrs>
        <Label>Confirm Password</Label>
        <div class="relative">
          <Input
            {...attrs}
            variant={$errors.confirm_password ? 'error' : 'default'}
            required={!!attrs['aria-required'] || undefined}
            type={confirm_password_visible ? 'text' : 'password'}
            bind:value={$formData.confirm_password}
          />
          <Button
            size="icon"
            variant="ghost"
            type="button"
            class="absolute inset-y-0 right-0"
            tabindex={-1}
            on:click={() => (confirm_password_visible = !confirm_password_visible)}
          >
            {#if confirm_password_visible}
              <Eye />
            {:else}
              <EyeOff />
            {/if}
          </Button>
        </div>
      </Form.Control>
      <Form.FieldErrors let:errors let:errorAttrs>
        {#if errors.length}
          <div class="my-1 rounded-md bg-red-100 px-2 py-1 italic text-red-800" {...errorAttrs}>
            {errors[0]}
          </div>
        {/if}
      </Form.FieldErrors>
    </Form.Field>
    <Button {loading} class="w-full" type="submit">Sign Up</Button>
  </form>
</TheCard>
