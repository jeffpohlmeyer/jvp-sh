<script lang="ts">
  import type { PageData } from './$types';
  import UsersTable from './users-table.svelte';

  import { Button } from '$lib/components/ui/button';

  export let data: PageData;
</script>

<Button href="/admin/users/create" class="mb-2.5" variant="ghost">Create New User</Button>
<UsersTable data={data.users} />
