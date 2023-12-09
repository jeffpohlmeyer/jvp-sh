<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  import TheCard from './TheCard.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  export let data: PageData;
  export let form: ActionData;
  export let title: string = '';
  export let action_text = 'Shorten';
</script>

<TheCard {title}>
  <span slot="title">{title}</span>
  <form method="post" class="space-y-3" use:enhance>
    <Label for="url">URL</Label>
    <Input
      type="text"
      name="redirect_link"
      id="url"
      value={form?.redirect_link ?? data.redirect_link}
      aria-invalid={form?.errors?.redirect_link ? 'true' : undefined}
    />
    {#if form?.errors?.redirect_link}
      <small class="text-primary italic">{form?.errors?.redirect_link}</small>
    {/if}
    <Button type="submit" class="block w-full">{action_text}</Button>
  </form>
</TheCard>
