<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div class={cn('rounded-lg bg-secondary/50 text-foreground shadow-md', className)} {...$$restProps}>
  <slot />
</div>
