<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;

  let password_visible = false;
  let confirm_password_visible = false;
  let message = '';

  function handle_input(event: InputEvent, field: 'password' | 'confirm_password') {
    const target = event.target as HTMLInputElement;
    $form[field] = target.value;
  }

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === 'success') {
        goto('/');
      } else if (result.type === 'failure') {
        if (result.data?.message) {
          message = result.data.message;
        }
        const error = result.data?.error;
        if (error === 'expired-token' || error === 'invalid-token') {
          message = `${message} Please go to <a href="/token/new/?token-type=reset-password">this page</a> to request a new activation token.`;
        }
      }
    }
  });
</script>

<h2>Reset Password</h2>
<p>Please enter your new password below.</p>
{#if message}
  <p class="error">{@html message}</p>
{/if}
<form method="post" use:enhance>
  <label for="password">Password</label>
  <input
    type={password_visible ? 'text' : 'password'}
    name="password"
    id="password"
    {...$constraints.password}
    value={$form.password}
    aria-invalid={$errors.password ? 'true' : undefined}
    on:input={(e) => handle_input(e, 'password')}
  />
  {#if $errors.password}
    <small class="text-red-500">{$errors.password}</small>
  {/if}
  <label for="confirm_password">Confirm Password</label>
  <input
    type={confirm_password_visible ? 'text' : 'password'}
    name="confirm_password"
    id="confirm_password"
    {...$constraints.confirm_password}
    value={$form.confirm_password}
    aria-invalid={$errors.confirm_password ? 'true' : undefined}
    on:input={(e) => handle_input(e, 'confirm_password')}
  />
  {#if $errors.confirm_password}
    <small class="text-red-500">{$errors.confirm_password}</small>
  {/if}
  <input type="hidden" name="token" value={$page.params.token} />
  <input type="submit" value="Log In" />
</form>
