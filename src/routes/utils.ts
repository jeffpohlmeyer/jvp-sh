import { z } from 'zod';

export const schema = z.object({
  redirect_link: z.string().url()
});
