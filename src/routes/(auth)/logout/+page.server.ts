import type { PageServerLoad, Actions } from './$types';

import { redirect } from 'sveltekit-flash-message/server';

import { logout_user } from '$lib/utils/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.user?.id) {
    throw redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    return await logout_user(event);
  }
};
