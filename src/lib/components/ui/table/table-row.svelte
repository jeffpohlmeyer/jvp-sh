<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    'data-state'?: unknown;
  };

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<tr
  class={cn(
    'border-b transition-colors hover:bg-accent/10 data-[state=selected]:bg-accent bg-background',
    className
  )}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</tr>
