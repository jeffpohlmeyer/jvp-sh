import { z } from 'zod';

export const schema = z
  .object({
    password: z.string().min(8),
    confirm_password: z.string().min(8),
    token: z.string().uuid()
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  });
