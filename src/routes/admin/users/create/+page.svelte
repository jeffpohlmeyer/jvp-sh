<script lang="ts">
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import { superForm } from 'sveltekit-superforms/client';

  import type { PageData } from './$types';
  import { schema } from './utils';

  import { afterNavigate } from '$app/navigation';
  import TheCard from '$lib/components/TheCard.svelte';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';

  export let data: PageData;
  let loading = false;

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

<TheCard title="Create New User">
  <span slot="title">Create New User</span>
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
    <Form.Field {form} name="active" class="space-y-1">
      <Form.Control let:attrs>
        <Form.Label>Active State</Form.Label>
        <div class="flex items-center space-x-2">
          <Switch includeInput {...attrs} bind:checked={$formData.active} id="active" />
          <Label for="active">
            {$formData.active ? 'Active' : 'Not Active'}
          </Label>
        </div>
      </Form.Control>
    </Form.Field>
    <Form.Field {form} name="is_admin" class="space-y-1">
      <Form.Control let:attrs>
        <Form.Label>Is Admin</Form.Label>
        <div class="flex items-center space-x-2">
          <Switch includeInput {...attrs} bind:checked={$formData.is_admin} id="is_admin" />
          <Label for="is_admin">
            {$formData.is_admin ? 'Admin' : 'Not Admin'}
          </Label>
        </div>
      </Form.Control>
    </Form.Field>
    <Button {loading} type="submit" class="block w-full">Create User</Button>
  </form>
</TheCard>
