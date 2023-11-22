import { z } from 'zod';

export const schema = z.object({
  email: z.string().email(),
  token_type: z.enum(['activation', 'reset-password'])
});
