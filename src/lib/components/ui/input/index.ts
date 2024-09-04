import type { HTMLInputAttributes } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';

import Root from './input.svelte';

const inputVariants = tv({
  base: 'flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-transparent file:bg-transparent',
  variants: {
    variant: {
      default:
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring file:text-foreground ring-offset-input focus-visible:ring-offset-2 border-input focus:border-input',
      error:
        'ring-white border-white focus:ring-destructive focus-visible:border-destructive focus:border-destructive focus-visible:ring-destructive'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

type Variant = VariantProps<typeof inputVariants>['variant'];

type Props = HTMLInputAttributes & {
  variant?: Variant;
};

type FormInputEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLInputElement;
};
export type InputEvents = {
  blur: FormInputEvent<FocusEvent>;
  change: FormInputEvent<Event>;
  click: FormInputEvent<MouseEvent>;
  focus: FormInputEvent<FocusEvent>;
  keydown: FormInputEvent<KeyboardEvent>;
  keypress: FormInputEvent<KeyboardEvent>;
  keyup: FormInputEvent<KeyboardEvent>;
  mouseover: FormInputEvent<MouseEvent>;
  mouseenter: FormInputEvent<MouseEvent>;
  mouseleave: FormInputEvent<MouseEvent>;
  paste: FormInputEvent<ClipboardEvent>;
  input: FormInputEvent<InputEvent>;
};

export {
  Root,
  type Props,
  //
  Root as Input,
  type Props as InputProps,
  inputVariants
};
