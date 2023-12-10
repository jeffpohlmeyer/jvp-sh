<script lang="ts">
  import { page } from '$app/stores';
  import * as Card from '$lib/components/ui/card';
</script>

<div class="max-w-2xl mx-auto">
  <Card.Root class=" {$$props.class}">
    <Card.Header>
      <Card.Title>Your Account</Card.Title>
      <Card.Description>Logged in as {$page.data.email}</Card.Description>
    </Card.Header>
    <Card.Content>
      <ul class="space-y-3">
        <li>
          <a href="/account/urls">Your Shortened URLs</a>
        </li>
        <li>
          <a href="/account/change-password">Change Password</a>
        </li>
        <li>
          <a href="/account/deactivate">Deactivate Account</a>
        </li>
        <li>
          <a href="/account/delete">Delete Account</a>
        </li>
        <li>
          <a href="/logout">Log Out</a>
        </li>
      </ul>
    </Card.Content>
  </Card.Root>
</div>
