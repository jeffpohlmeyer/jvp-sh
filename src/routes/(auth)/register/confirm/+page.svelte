<script lang="ts">
  import TheCard from '$lib/components/TheCard.svelte';
</script>

<TheCard title="Registered">
  <span slot="title">Registered!</span>
  <p>
    You have successfully registered! You've been sent an email with a link to activate your
    account. If you don't receive it shortly please check your spam folder.
  </p>
</TheCard>
