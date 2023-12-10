<script lang="ts">
  import TheCard from '$lib/components/TheCard.svelte';
</script>

<TheCard title="Admin Section">
  <span slot="title">Admin Section</span>
  <ul class="space-y-3">
    <li>
      <a href="/admin/users">Users</a>
    </li>
    <li>
      <a href="/admin/urls">URLs</a>
    </li>
  </ul>
</TheCard>
