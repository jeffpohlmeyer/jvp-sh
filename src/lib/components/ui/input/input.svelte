<script lang="ts">
  import { type InputEvents, inputVariants, type Props } from './index';

  import { cn } from '$lib/utils';

  type $$Props = Props;
  type $$Events = InputEvents;

  let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'default';
  export let value: $$Props['value'] = undefined;
  export { className as class };
</script>

<input
  class={cn(inputVariants({ variant, className }))}
  bind:value
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
  {...$$restProps}
/>
