<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  export let url: string;

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === 'success') {
        url = result?.data?.url ?? '';
      }
    }
  });
</script>

<h2>Shorten any URL!</h2>
<form method="post" use:enhance>
  <label for="url">URL</label>
  <input
    type="text"
    name="redirect_link"
    id="url"
    {...$constraints.redirect_link}
    bind:value={$form.redirect_link}
    aria-invalid={$errors.redirect_link ? 'true' : undefined}
  />
  {#if $errors.redirect_link}
    <small class="text-red-500">{$errors.redirect_link}</small>
  {/if}
  <input type="submit" value="Shorten" />
</form>
{#if url}
  <h2>Success!</h2>
  Your shortened url is
  <a href={url} target="_blank">{url}</a>
{/if}
