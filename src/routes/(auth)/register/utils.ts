import { z } from 'zod';
import type { ObjectRefineType } from '$lib/utils/form';

export const schema = {
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8)
};

export const object_refine: ObjectRefineType[] = [
  {
    _function: (obj: any) => obj.password === obj.confirm_password,
    _details: {
      message: 'Passwords must match',
      path: ['confirm_password']
    }
  }
];
