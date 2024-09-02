<script lang="ts">
  import { page } from '$app/stores';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import * as Card from '$lib/components/ui/card';

  export let title = '';
  export let metadescription = '';
</script>

<MetaTags pageTitle={title} siteUrl={$page.url.href} {metadescription} />

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-2xl {$$props.class}">
  <Card.Header>
    <Card.Title>
      <slot name="title" />
    </Card.Title>
    <Card.Description>
      <slot name="sub-title" />
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <slot name="alert" />
    <slot />
  </Card.Content>
  <!--  <div class="sm:py-24 sm:px-6 lg:px-8">-->
  <!--    <div class="sm:mx-auto sm:w-full sm:max-w-md sm:space-y-8">-->
  <!--      <div class="rounded-xl border">-->
  <!--        <h2 class="px-4 pt-6 text-center text-3xl font-bold tracking-tight text-primary">-->
  <!--          <slot name="title" />-->
  <!--        </h2>-->
  <!--        <p class="mt-2 px-2 text-center text-sm text-gray-600">-->
  <!--          <slot name="subTitle" />-->
  <!--        </p>-->
  <!--        <div class="sm:mx-auto sm:w-full sm:max-w-md">-->
  <!--          <div class="px-4 pt-2 pb-8 sm:px-10">-->
  <!--            <slot />-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</Card.Root>
