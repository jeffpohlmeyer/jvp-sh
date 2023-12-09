import { z } from 'zod';

export const schema = {
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  token: z.string().uuid()
};

export const object_refine = [
  {
    _function: (obj: any) => obj.password === obj.confirm_password,
    _details: {
      message: 'Passwords must match',
      path: ['confirm_password']
    }
  }
];
