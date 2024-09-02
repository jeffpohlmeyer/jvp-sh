<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { valibotClient } from 'sveltekit-superforms/adapters';

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
    onSubmit: async () => {
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

<TheCard title="Forgot Password">
  <span slot="title">Forgot Password</span>
  <span slot="sub-title">Please enter your email to reset your password.</span>
  {#if $message}
    <Alert.Root
      class={$message.status === 'error'
        ? 'bg-red-100 text-red-600'
        : 'bg-green-100 text-green-600'}
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
  <form use:enhance class="space-y-2" method="POST">
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
    <Button {loading} type="submit" class="block w-full">Send</Button>
  </form>
</TheCard>
