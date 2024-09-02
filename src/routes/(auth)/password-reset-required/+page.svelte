<script>
import TheCard from '$lib/components/TheCard.svelte';
</script>

<TheCard title="Password Reset Required">
  <span slot="title">Password Reset Required</span>
  <div class="space-y-3">
    <p>
      Due to a need to upgrade the hashing algorithm used to store passwords all previously saved
      passwords are no longer valid.
    </p>
    <p>
      A link has been sent to your email that will allow you to reset your password, in a manner
      similar to if you've forgotten your password and need to reset it.
    </p>
  </div>
</TheCard>