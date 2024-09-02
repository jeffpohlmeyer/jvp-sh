<script lang="ts">
  import type { PageData } from './$types';

  import { page } from '$app/stores';
  import URLInput from '$lib/components/URLInput.svelte';

  export let data: PageData;
</script>

<div class="space-y-3 pb-3 sm:mx-auto sm:w-full sm:max-w-2xl">
  <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Welcome to jvp.sh!</h1>
  <p class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
    A simple link shortener.
    {#if $page.data.user_id}
      You currently have {data.link_count} links associated with your
      <a href="/account" data-sveltekit-preload-data="tap">account.</a>
      Add another one below!
    {:else}
      No need to <a href="/register" data-sveltekit-preload-data="tap">create an account</a>
      though you can if you'd like to track clicks of links you've shortened.
    {/if}
  </p>
  <URLInput
    title="Shorten any URL"
    metadescription="A simple link shortener. No sign-up required."
    {data}
  />
</div>
