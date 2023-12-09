import { z } from 'zod';

export const schema = {
  email: z
    .string()
    .min(1, 'Please provide an email address')
    .email('Please provide a valid email address')
};
