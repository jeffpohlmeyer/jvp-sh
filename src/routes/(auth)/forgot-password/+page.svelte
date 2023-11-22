<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  let message = '';

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === 'failure') {
        if (result.data?.message) {
          message = result.data.message;
        } else {
          message = 'There was an error sending the email. Please try again later.';
        }
      }
    }
  });
</script>

<h2>Forgot Password</h2>
<p>Please enter your email to reset your password.</p>
{#if message}
  <p>{message}</p>
{/if}
<form method="post" use:enhance>
  <label for="email">Email</label>
  <input
    type="email"
    name="email"
    id="email"
    {...$constraints.email}
    bind:value={$form.email}
    aria-invalid={$errors.email ? 'true' : undefined}
  />
  {#if $errors.email}
    <small class="text-red-500">{$errors.email}</small>
  {/if}
  <input type="submit" value="Send" />
</form>
