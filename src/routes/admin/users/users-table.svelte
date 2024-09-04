<script lang="ts">
  import { readable } from 'svelte/store';
  import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
  import { addSortBy } from 'svelte-headless-table/plugins';
  import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-svelte';

  import type { PageData } from './$types';
  import UserTableActions from './user-actions.svelte';

  import { Button } from '$lib/components/ui/button';
  import * as Table from '$lib/components/ui/table';

  export let data: PageData['users'] = [];

  const table = createTable(readable(data), {
    sort: addSortBy({ initialSortKeys: [{ id: 'created_at', order: 'desc' }] })
  });

  const columns = table.createColumns([
    table.column({
      accessor: 'email',
      header: 'Email'
    }),
    table.column({
      accessor: 'created_at',
      header: 'Created At',
      cell: ({ value }) => new Date(value).toLocaleString()
    }),
    table.column({
      accessor: 'active',
      header: 'Active',
      cell: ({ value }) => (value ? 'Yes' : 'No')
    }),
    table.column({
      accessor: 'is_admin',
      header: 'Admin',
      cell: ({ value }) => (value ? 'Yes' : 'No')
    }),
    table.column({
      accessor: ({ id }) => id,
      header: '',
      cell: ({ value }) => createRender(UserTableActions, { id: value }),
      plugins: { sort: { disable: true } }
    })
  ]);

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
                      class="flex space-x-2 hover:bg-primary hover:text-background"
                      on:click={props.sort.toggle}
                    >
                      <Render of={cell.render()} />
                      {#if props.sort.order === 'desc'}
                        <ChevronDown class="ml-2 h-4 w-4" />
                      {:else if props.sort.order === 'asc'}
                        <ChevronUp class="ml-2 h-4 w-4" />
                      {:else}
                        <ChevronsUpDown class="ml-2 h-4 w-4" />
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
                  {#if cell.id === 'is_admin' || cell.id === 'active'}
                    <div class="pl-6">
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
