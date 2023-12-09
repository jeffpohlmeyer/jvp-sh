import { z } from 'zod';

export const schema = {
  redirect_link: z.string().url()
};
