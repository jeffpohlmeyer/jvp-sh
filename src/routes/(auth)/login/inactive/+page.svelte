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
</script>

<TheCard title="Account Not Active">
  <span slot="title">Activation Required</span>
  <span slot="sub-title">
    Your account is not yet active. Please click the link in the email that was previously sent to
    you. If you need a new activation link please fill out the form below.
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
    <Button {loading} class="w-full" type="submit">Submit</Button>
  </form>
</TheCard>
