import type { Actions, PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { must_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { logout_user } from '$lib/utils/auth';

export const load: PageServerLoad = (event) => {
  must_be_logged_in(event);
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const { locals, url } = event;
    if (!locals.user) {
      throw redirect(
        302,
        `/login?redirect=${url.pathname}`,
        { type: 'error', message: 'You must be logged in to do that.' },
        event
      );
    }

    await db.update(user).set({ active: false }).where(eq(user.id, locals.user.id));
    return await logout_user(event, 'Your account has been deactivated.');
  }
};
