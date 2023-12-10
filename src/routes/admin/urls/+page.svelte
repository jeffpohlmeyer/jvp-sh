<script lang="ts">
  import type { PageData } from './$types';

  import UrlsTable from '$lib/components/tables/urls-table.svelte';
  export let data: PageData;
</script>

<UrlsTable access_type="admin" data={data.urls} />
