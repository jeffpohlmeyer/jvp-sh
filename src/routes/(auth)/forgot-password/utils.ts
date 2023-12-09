import { z } from 'zod';

export const schema = {
  email: z.string().email()
};
