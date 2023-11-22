import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { AUTH_TOKEN_NAME } from '$env/static/private';
import { invalidate_sessions } from '$lib/utils/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.user?.id) {
    throw redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ cookies }) => {
    const session_id = cookies.get(AUTH_TOKEN_NAME);
    if (!session_id) {
      return fail(404, { error: 'token-not-found', message: 'Session token not found.' });
    }
    await invalidate_sessions({ session_id });
    cookies.set(AUTH_TOKEN_NAME, '', { path: '/', maxAge: 0 });
    throw redirect(302, '/login');
  }
};
