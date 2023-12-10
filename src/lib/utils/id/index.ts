import { customAlphabet } from 'nanoid';
export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

export const prefixes = {
  session: 'session',
  token: 'token',
  user: 'user',
  url: 'url'
} as const;

export function new_id(prefix: keyof typeof prefixes, length = 16): string {
  return [prefixes[prefix], nanoid(length)].join('_');
}
