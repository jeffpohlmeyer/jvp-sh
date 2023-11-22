<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';

  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  let password_visible = false;
  let message = '';
  function handle_input(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    $form.password = target.value;
  }

  const { form, errors, constraints, enhance } = superForm(data.form, {
    resetForm: true,
    onResult: async ({ result }) => {
      console.log('result in login', result);
      if (result.type === 'success') {
        await goto('/');
      } else if (result.type === 'failure') {
        if (result.data?.message) {
          message = result.data.message;
        }
      }
    }
  });
</script>

<h2>Log In</h2>
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
  <label for="password">Password</label>
  <input
    type={password_visible ? 'text' : 'password'}
    name="password"
    id="password"
    {...$constraints.password}
    value={$form.password}
    aria-invalid={$errors.password ? 'true' : undefined}
    on:input={handle_input}
  />
  {#if $errors.email}
    <small class="text-red-500">{$errors.password}</small>
  {/if}
  <input type="submit" value="Log In" />
</form>
<a href="/forgot-password">Forgot Password</a>
