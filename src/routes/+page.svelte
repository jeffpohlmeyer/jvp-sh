<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { page } from '$app/stores';

  import URLInput from '$lib/components/URLInput.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="sm:max-w-2xl sm:mx-auto sm:w-full pb-3 space-y-3">
  <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
    Welcome to jvp.sh!
  </h1>
  <h2 class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
    A simple link shortener.
    {#if $page.data.user_id}
      You currently have {data.link_count} links associated with your
      <a href="/account">account.</a>
      Add another one below!
    {:else}
      No need to <a href="/register">create an account</a>
      though you can if you'd like to track clicks of links you've shortened.
    {/if}
  </h2>
  <URLInput title="Shorten any URL" {data} {form} />
</div>
