<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let message: string;

  onMount(async () => {
    const { token } = $page.params;
    const form_data = new FormData();
    form_data.append('token', token);
    const res = await fetch(`/api/token/activation`, {
      method: 'POST',
      body: form_data
    });
    if (res.ok) {
      return await goto('/');
    }
    const json = await res.json();
    message = json.message;
    const error = json.error;
    if (error === 'token-not-found') {
      message = `${message} Please go to <a href="/login/inactive">this page</a> to try again.`;
    } else if (error === 'expired-token' || error === 'invalid-token') {
      message = `${message} Please go to <a href="/token/new/?token-type=activation">this page</a> to request a new activation token.`;
    }
  });
</script>

<h2>Activating...</h2>
<p>Activating your account. Please wait.</p>
{#if message}
  <p>{@html message}</p>
{/if}
