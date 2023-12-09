<script lang="ts">
  import { name } from '$lib/info';
  export let article = false;
  export let datePublished: string = '';
  export let lastUpdated: string = '';
  export let facebookAuthorPage: string = '';
  export let facebookPage: string = '';
  export let image: { url: string; alt: string } = { url: '', alt: '' };
  export let squareImage: { url: string; alt?: string } = { url: '', alt: '' };
  export let metadescription: string = '';
  export let ogLanguage = 'en_US';
  export let pageTitle: string = '';
  export let siteTitle = 'jvp.sh';
  export let siteUrl: string = '';

  $: metaTitle = pageTitle ? `${pageTitle} | ${name}` : name;
</script>

<svelte:head>
  <title>{metaTitle}</title>
  <meta property="og:site_name" content={siteTitle} />
  <meta property="og:locale" content={ogLanguage} />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:type" content={article ? 'article' : 'website'} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={metadescription} />
  <meta name="twitter:summary_large_image" />
  <meta name="twitter:description" content={metadescription} />
  <meta name="twitter:title" content={pageTitle} />
  {#if image.url}
    <meta property="og:image" content={image.url} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="627" />
    <meta property="og:image:alt" content={image.alt} />
    <meta name="twitter:image" content={image.url} />
    <meta name="twitter:image:alt" content={image.alt} />
  {/if}
  {#if squareImage.url}
    <meta property="og:image" content={squareImage.url} />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="400" />
    <meta property="og:image:alt" content={image.alt} />
  {/if}
  {#if article}
    <meta property="article:publisher" content={facebookPage} />
    <meta property="article:author" content={facebookAuthorPage} />
    <meta property="article:published_time" content={datePublished} />
    <meta property="article:modified_time" content={lastUpdated} />
  {/if}
</svelte:head>
