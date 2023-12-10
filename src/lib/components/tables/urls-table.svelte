<script lang="ts">
  import { page } from '$app/stores';
  import { readable } from 'svelte/store';
  import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
  import { addSortBy } from 'svelte-headless-table/plugins';
  import Icon from '@iconify/svelte';

  import { Button } from '$lib/components/ui/button';
  import * as Table from '$lib/components/ui/table';
  import UrlLinkCell from './url-link-cell.svelte';
  import UrlTableActions from './url-table-actions.svelte';

  import type { URLsType } from '$lib/server/schema/types';

  export let data: URLsType[] = [];
  export let access_type: 'admin' | 'regular';

  const table = createTable(readable(data), {
    sort: addSortBy({ initialSortKeys: [{ id: 'created_at', order: 'desc' }] })
  });

  const _columns = [
    table.column({
      accessor: ({ endpoint }) => endpoint,
      header: 'JVP.sh Endpoint',
      cell: ({ value }) => {
        const url = `${$page.url.origin}/${value}`;
        return createRender(UrlLinkCell, { url });
      }
    }),
    table.column({
      accessor: ({ redirect_link }) => redirect_link,
      header: 'Redirect Link',
      cell: ({ value }) => createRender(UrlLinkCell, { url: value, href: value, target: '_blank' })
    }),
    table.column({
      accessor: 'created_at',
      header: 'Created At',
      cell: ({ value }) => new Date(value).toLocaleString()
    }),
    table.column({ accessor: 'version', header: 'Version' }),
    table.column({ accessor: 'clicked', header: 'Number of Clicks' })
  ];
  if (access_type === 'regular') {
    _columns.push(
      table.column({
        accessor: ({ id }) => id,
        header: '',
        cell: ({ value }) => createRender(UrlTableActions, { id: value }),
        plugins: { sort: { disable: true } }
      })
    );
  } else {
    _columns.push(
      table.column({
        accessor: 'email',
        header: 'Owner',
        cell: ({ value }) => {
          if (!value) return '';
          return value;
        }
      })
    );
  }
  const columns = table.createColumns(_columns);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row class="hover:bg-background">
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                <Table.Head {...attrs}>
                  {#if !props.sort.disabled}
                    <Button
                      variant="ghost"
                      class="hover:bg-primary hover:text-background"
                      on:click={props.sort.toggle}
                    >
                      <Render of={cell.render()} />
                      {#if props.sort.order === 'desc'}
                        <Icon icon="lucide:chevron-down" class="ml-2 h-4 w-4" />
                      {:else if props.sort.order === 'asc'}
                        <Icon icon="lucide:chevron-up" class="ml-2 h-4 w-4" />
                      {:else}
                        <Icon icon="lucide:chevrons-up-down" class="ml-2 h-4 w-4" />
                      {/if}
                    </Button>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  {#if cell.id === 'version' || cell.id === 'clicked'}
                    <div class="text-center">
                      <Render of={cell.render()} />
                    </div>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
