<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';

  import { Button } from '$lib/components/ui/button';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import TheCard from '$lib/components/TheCard.svelte';

  export let data: PageData;
  let iframe = false;
</script>

<MetaTags
  pageTitle="URL {data.endpoint}"
  metadescription="The details of the URL that ends with {data.endpoint}"
  siteUrl={$page.url.href}
/>

<TheCard title="URL {data.endpoint}" class="mb-4">
  <span slot="title">URL {$page.url.protocol}//{$page.url.host}/{data.endpoint}</span>

  <ul class="text-sm md:text-base lg:text-lg xl:text-xl pb-3">
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
  <Button on:click={() => (iframe = !iframe)} class="w-full block">
    {iframe ? 'Hide' : 'Show'} Preview
  </Button>
</TheCard>

{#if iframe}
  <iframe
    src={data.redirect_link}
    title={data.redirect_link}
    class="w-full h-[65%] rounded-md shadow-lg"
  ></iframe>
{/if}
