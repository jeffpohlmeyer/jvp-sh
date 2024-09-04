<script lang="ts">
  export let id: string;
  import { Edit, Trash } from 'lucide-svelte';
</script>

<div class="flex space-x-2.5">
  <a href="/admin/users/{id}/edit" data-sveltekit-preload-data="tap">
    <Edit class="h-5 w-5 text-primary" />
  </a>
  <a href="/admin/users/{id}/delete" data-sveltekit-preload-data="tap">
    <Trash class="h-5 w-5 text-red-500" />
  </a>
</div>
