<script lang="ts">
  import { page } from '$app/stores';
  import * as Card from '$lib/components/ui/card';
</script>

<div class="mx-auto max-w-2xl">
  <Card.Root class=" {$$props.class}">
    <Card.Header>
      <Card.Title>Your Account</Card.Title>
      <Card.Description>Logged in as {$page.data.email}</Card.Description>
    </Card.Header>
    <Card.Content>
      <ul class="space-y-3">
        <li>
          <a href="/account/urls" data-sveltekit-preload-data="tap">Your Shortened URLs</a>
        </li>
        <li>
          <a href="/account/change-password" data-sveltekit-preload-data="tap">Change Password</a>
        </li>
        <li>
          <a href="/account/deactivate" data-sveltekit-preload-data="tap">Deactivate Account</a>
        </li>
        <li>
          <a href="/account/delete" data-sveltekit-preload-data="tap">Delete Account</a>
        </li>
        <li>
          <a href="/logout" data-sveltekit-preload-data="tap">Log Out</a>
        </li>
      </ul>
    </Card.Content>
  </Card.Root>
</div>
