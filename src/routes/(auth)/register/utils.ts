import { z } from 'zod';

export const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8)
  })
  .refine((obj) => obj.password === obj.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password']
  });
