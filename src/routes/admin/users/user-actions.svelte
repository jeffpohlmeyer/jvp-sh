<script lang="ts">
  import Icon from '@iconify/svelte';
  export let id: string;
</script>

<div class="flex space-x-2.5">
  <a href="/admin/users/{id}/edit">
    <Icon icon="mdi:pencil" class="text-primary h-5 w-5" />
  </a>
  <a href="/admin/users/{id}/delete">
    <Icon icon="mdi:delete" class="text-red-500 h-5 w-5" />
  </a>
</div>
