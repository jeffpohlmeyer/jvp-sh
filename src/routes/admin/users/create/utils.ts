import { z } from 'zod';

export const schema = {
  email: z.string().min(1, 'Email is required').email(),
  active: z.coerce.boolean().default(false),
  is_admin: z.coerce.boolean().default(false)
};
