import { z } from 'zod';

export const schema = {
  email: z.string().email(),
  password: z.string().min(8)
};
