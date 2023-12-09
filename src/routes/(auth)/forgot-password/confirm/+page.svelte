<script lang="ts">
  import TheCard from '$lib/components/TheCard.svelte';
</script>

<TheCard title="Email Sent">
  <span slot="title">Email sent!</span>
  <p>
    A message has been sent with a link that will allow you to reset your password. If you don't
    receive it shortly please check your spam folder.
  </p>
</TheCard>
