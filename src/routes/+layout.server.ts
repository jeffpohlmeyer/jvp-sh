import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals }) => {
  return {
    user_id: locals.user?.id,
    is_admin: locals.user?.is_admin,
    email: locals.user?.email,
    from_server: locals.from_server
  };
});
