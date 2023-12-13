<script>
  import { page } from '$app/stores';
  import '../app.pcss';

  import TheFlash from './TheFlash.svelte';
</script>

<div class="flex flex-col h-100svh md:h-100lvh max-w-7xl mx-auto">
  <header class="flex justify-between items-center py-4 px-4 xl:px-0">
    <a href="/" class="no-underline">Home</a>
    <div class="flex items-center space-x-2">
      {#if $page.data.is_admin}
        <a href="/admin" class="no-underline">Admin</a>
      {/if}
      {#if $page.data.user_id}
        <a href="/account" class="no-underline">Account</a>
      {:else}
        <a href="/login" class="no-underline">Login</a>
      {/if}
    </div>
  </header>
  <main class="grow mx-auto w-full relative pt-4 sm:pt-8 md:pt-12 lg:pt-16 xl:pt-20 px-4 xl:px-0">
    <slot />
    <TheFlash />
  </main>
  <footer class="absolute bottom-4 inset-x-0 mx-auto text-center text-xs text-background">
    <div class="inline-flex space-x-2">
      <span>
        designed, built, and hosted by <a
          href="https://www.jvp.design"
          class="text-background"
          target="_blank"
        >
          jvp.design
        </a>
        in {new Date().getFullYear()}
      </span>
      <a href="/privacy" class="text-background">privacy policy</a>
    </div>
  </footer>
</div>
