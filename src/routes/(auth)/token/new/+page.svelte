<script lang="ts">
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import { superForm } from 'sveltekit-superforms/client';

  import type { PageData } from './$types';
  import { schema } from './util';

  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import TheCard from '$lib/components/TheCard.svelte';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let data: PageData;
  let loading = false;
  const form = superForm(data.form, {
    validators: valibotClient(schema),
    resetForm: false,
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

  $: title =
    $page.url.searchParams.get('token-type') === 'confirm'
      ? 'New Activation Token Request'
      : 'New Password Reset Request';
  $: short_title =
    $page.url.searchParams.get('token-type') === 'confirm' ? 'Activation' : 'Password Reset';
</script>

<TheCard title={short_title}>
  <span slot="title">{title}</span>
  <span slot="sub-title">
    {#if $page.url.searchParams.get('token-type') === 'confirm'}
      <p>Enter your email address below to request a new activation token.</p>
    {:else}
      <p>Enter your email address below to request a new password reset token.</p>
    {/if}
  </span>
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
    <Form.Field {form} name="email" class="space-y-0 pb-2">
      <Form.Control let:attrs>
        <Label>Email</Label>
        <Input
          {...attrs}
          variant={$errors.email ? 'error' : 'default'}
          required={!!attrs['aria-required'] || undefined}
          type="email"
          class="focus-me"
          bind:value={$formData.email}
        />
      </Form.Control>
      <Form.FieldErrors let:errors let:errorAttrs>
        {#if errors.length}
          <div class="my-1 rounded-md bg-red-100 px-2 py-1 italic text-red-800" {...errorAttrs}>
            {errors[0]}
          </div>
        {/if}
      </Form.FieldErrors>
    </Form.Field>
    <Button {loading} class="w-full" type="submit">Request Token</Button>
  </form>
</TheCard>
