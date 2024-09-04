<script lang="ts">
  import TheFlash from './TheFlash.svelte';

  import '../app.pcss';

  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="mx-auto flex min-h-[100svh] max-w-7xl flex-col md:min-h-[100lvh]">
  <Navbar />
  <main class="relative mx-auto w-full grow px-4 pt-4 sm:pt-8 md:pt-12 lg:pt-16 xl:px-0 xl:pt-20">
    <slot />
    <TheFlash />
  </main>
  <Footer />
</div>
