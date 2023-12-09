import { z } from 'zod';

export const schema = {
  email: z.string().email(),
  token_type: z.enum(['activation', 'reset-password'])
};
