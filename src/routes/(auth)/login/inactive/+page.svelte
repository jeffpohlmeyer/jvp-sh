<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  import TheCard from '$lib/components/TheCard.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import * as Alert from '$lib/components/ui/alert';

  export let data: PageData;
  export let form: ActionData;

  // const { form, errors, constraints, enhance } = superForm(data.form, {
  //   onResult: ({ result }) => {
  //     console.log('result in inactive', result);
  //     if (result.type === 'success') {
  //       console.log('success');
  //     } else if (result.type === 'failure') {
  //       if (result.data?.error) {
  //         message = result.data.error;
  //       }
  //     }
  //   }
  // });
</script>

<TheCard title="Account Not Active">
  <span slot="title">Activation Required</span>
  <span slot="sub-title">
    Your account is not yet active. Please click the link in the email that was previously sent to
    you. If you need a new activation link please fill out the form below.
  </span>
  <form method="post" class="space-y-3" use:enhance>
    {#if form?.error}
      <Alert.Root slot="alert" variant="destructive" class="w-full">
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{form.error}</Alert.Description>
      </Alert.Root>
    {/if}
    <div>
      <label for="email">Email</label>
      <Input type="email" name="email" id="email" value={form?.email ?? data.email} />
      {#if form?.errors?.email}
        <small class="text-primary italic">{form?.errors?.email}</small>
      {/if}
    </div>
    <Button type="submit" class="block w-full">Submit</Button>
  </form>
</TheCard>
