<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui';
  import { Loader } from 'lucide-svelte';

  import { buttonVariants, type Events, type Props } from './index';

  import { cn } from '$lib/utils';

  type $$Props = Props;
  type $$Events = Events;

  let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'default';
  export let builders: $$Props['builders'] = [];
  export let loading: $$Props['loading'] = false;
  export let disabled: $$Props['disabled'] = false;
  export { className as class };
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  disabled={loading || disabled}
  {...$$restProps}
  on:click
  on:keydown
>
  <div class="flex items-center justify-center space-x-2">
    {#if loading}
      <Loader class="animate-spin" />
    {/if}
    <slot />
  </div>
</ButtonPrimitive.Root>
