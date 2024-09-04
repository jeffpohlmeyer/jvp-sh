<script lang="ts">
  import { valibotClient } from 'sveltekit-superforms/adapters';
  import { superForm } from 'sveltekit-superforms/client';

  import type { PageData } from './$types';
  import TheCard from './TheCard.svelte';

  import { afterNavigate } from '$app/navigation';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button/index';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input/index';
  import { Label } from '$lib/components/ui/label/index';
  import { url_schema } from '$lib/utils';

  export let title: string = '';
  export let action_text = 'Shorten';
  export let metadescription = '';

  export let data: PageData;
  let loading = false;
  const form = superForm(data.form, {
    validators: valibotClient(url_schema),
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

<TheCard {title} {metadescription}>
  <span slot="title">{title}</span>
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
    <Form.Field {form} name="redirect_link" class="space-y-0 pb-2">
      <Form.Control let:attrs>
        <Label>URL</Label>
        <Input
          {...attrs}
          variant={$errors.redirect_link ? 'error' : 'default'}
          required={!!attrs['aria-required'] || undefined}
          type="url"
          class="focus-me"
          bind:value={$formData.redirect_link}
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

    <Button {loading} class="w-full" type="submit">{action_text}</Button>
  </form>
</TheCard>
