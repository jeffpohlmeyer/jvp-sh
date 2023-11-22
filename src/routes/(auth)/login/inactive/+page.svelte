<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  let message = '';

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: ({ result }) => {
      console.log('result in inactive', result);
      if (result.type === 'success') {
        console.log('success');
      } else if (result.type === 'failure') {
        if (result.data?.error) {
          message = result.data.error;
        }
      }
    }
  });
</script>

<h2>Activation required</h2>
<p>
  Your account is not yet active. Please click the link in the email that was previously sent to
  you. If you need a new activation link please fill out the form below.
</p>
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
  <input type="submit" value="Submit" />
</form>
