<script lang="ts">
  import type { PageData } from './$types';

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
    onResult: async ({ result }) => {
      if (result.type === 'failure') {
        console.log(result.data?.error);
        if (result.data?.message) {
          message = result.data.message;
        }
      }
    }
  });
</script>

<h2>Sign Up</h2>
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
  <label for="password">Password</label>
  <input
    type={password_visible ? 'text' : 'password'}
    name="password"
    data-testid="password"
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
    data-testid="confirm_password"
    id="confirm_password"
    {...$constraints.confirm_password}
    value={$form.confirm_password}
    aria-invalid={$errors.confirm_password ? 'true' : undefined}
    on:input={(e) => handle_input(e, 'confirm_password')}
  />
  {#if $errors.confirm_password}
    <small class="text-red-500">{$errors.confirm_password}</small>
  {/if}
  <input type="submit" data-testid="submit" value="Sign Up" />
</form>
