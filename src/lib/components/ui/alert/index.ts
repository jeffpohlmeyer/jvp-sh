import { tv, type VariantProps } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
  base: 'relative w-full rounded-lg border p-4 [&>svg:first-child]:absolute [&>svg:first-child]:text-foreground [&>svg:first-child]:left-4 [&>svg:first-child]:top-4 [&>svg:first-child+div]:translate-y-[-3px] [&:has(svg)]:pl-11',

  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive:
        'text-destructive bg-destructive/10 border-destructive/50 dark:border-destructive [&>svg]:text-destructive'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
  Root,
  Description,
  Title,
  //
  Root as Alert,
  Description as AlertDescription,
  Title as AlertTitle
};
