<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import UrlsTable from './urls-table.svelte';

  export let data: PageData;
</script>

<MetaTags
  pageTitle="Your URLs"
  metadescription="Here are all the URLs you have shortened."
  siteUrl={$page.url.href}
/>

<UrlsTable data={data.urls} />
