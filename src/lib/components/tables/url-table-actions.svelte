<script lang="ts">
  import Icon from '@iconify/svelte';
  export let id: string;
</script>

<div class="flex space-x-2.5">
  <a href="/account/urls/{id}/edit" data-sveltekit-preload-data="tap">
    <Icon icon="mdi:pencil" class="h-5 w-5 text-primary" />
  </a>
  <a href="/account/urls/{id}/delete" data-sveltekit-preload-data="tap">
    <Icon icon="mdi:delete" class="h-5 w-5 text-red-500" />
  </a>
</div>
