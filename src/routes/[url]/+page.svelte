<script lang="ts">
  import { getFlash } from 'sveltekit-flash-message';
  import Icon from '@iconify/svelte';

  import type { PageData } from './$types';

  import { page } from '$app/stores';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import TheCard from '$lib/components/TheCard.svelte';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
  let iframe = false;

  $: url = `${$page.url.protocol}//${$page.url.host}/${data.endpoint}`;

  const flash = getFlash(page);
  function copy_url() {
    navigator.clipboard.writeText(url);
    $flash = { type: 'success', message: 'Copied to Clipboard!', timeout: 2500 };
  }
</script>

<MetaTags
  pageTitle="URL {data.endpoint}"
  metadescription="The details of the URL that ends with {data.endpoint}"
  siteUrl={$page.url.href}
/>

<TheCard title="URL {data.endpoint}" class="mb-4">
  <span slot="title">Shortened URL</span>
  <span slot="sub-title" class="flex items-center space-x-3">
    <span>{url}</span>
    <Button variant="outline" size="xs" on:click={copy_url}>
      <Icon icon="lucide:copy" class="h-4 w-4" />
    </Button>
  </span>

  <ul class="pb-3 text-sm md:text-base lg:text-lg xl:text-xl">
    <li>
      Redirects to <a
        href={data.redirect_link}
        class="italic"
        rel="noopener noreferrer"
        target="_blank"
      >
        {data.redirect_link}
      </a>
    </li>
    <li>
      Created at {new Date(data.created_at).toLocaleString()}
    </li>
    <li>
      Version {data.version} has been clicked {data.clicked} times
    </li>
  </ul>
  <Button on:click={() => (iframe = !iframe)} class="block w-full">
    {iframe ? 'Hide' : 'Show'} Preview
  </Button>
</TheCard>

{#if iframe}
  <iframe
    src={data.redirect_link}
    title={data.redirect_link}
    class="z-20 h-[65%] w-full rounded-md bg-background shadow-lg"
  ></iframe>
{/if}
