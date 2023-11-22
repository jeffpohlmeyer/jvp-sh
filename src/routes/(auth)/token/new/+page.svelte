<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  let message = '';

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: async ({ result }) => {
      console.log('result', result);
      if (result.type === 'failure') {
        console.log(result.data?.error);
        if (result.data?.message) {
          message = result.data.message;
        } else if (result.data?.form?.errors?.token_type?.includes('Required')) {
          message = 'A token type must be included';
        }
      }
    }
  });

  $: title =
    $page.url.searchParams.get('token-type') === 'activation'
      ? 'New Activation Token Request'
      : 'New Password Reset Request';
</script>

<h1>{title}</h1>
{#if $page.url.searchParams.get('token-type') === 'activation'}
  <p>Enter your email address below to request a new activation token.</p>
{:else}
  <p>Enter your email address below to request a new password reset token.</p>
{/if}

{#if message}
  <p>{message}</p>
{/if}
<form method="post" use:enhance>
  <label for="email">Email</label>
  <input
    type="email"
    name="email"
    data-testid="email"
    id="email"
    {...$constraints.email}
    bind:value={$form.email}
    aria-invalid={$errors.email ? 'true' : undefined}
  />
  {#if $errors.email}
    <small class="text-red-500">{$errors.email}</small>
  {/if}
  <input type="hidden" id="token-type" name="token_type" value={$form.token_type} />

  <button type="submit">Request Token</button>
</form>
