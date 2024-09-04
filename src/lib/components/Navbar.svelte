<script>
  import { page } from '$app/stores';
</script>

<header class="flex items-center justify-between px-4 py-4 xl:px-0">
  <a href="/" class="no-underline" data-sveltekit-preload-data="tap">Home</a>
  <div class="flex items-center space-x-2">
    {#if $page.data.is_admin}
      <a href="/admin" class="no-underline" data-sveltekit-preload-data="tap">Admin</a>
    {/if}
    {#if $page.data.user_id}
      <a href="/account" class="no-underline" data-sveltekit-preload-data="tap">Account</a>
    {:else}
      <a href="/login" class="no-underline" data-sveltekit-preload-data="tap">Login</a>
    {/if}
  </div>
</header>
