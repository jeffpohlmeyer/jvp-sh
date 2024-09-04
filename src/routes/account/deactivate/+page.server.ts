import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';

import { must_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema';
import { invalidate_all_user_sessions } from '$lib/utils/auth';

export const load: PageServerLoad = (event) => {
  must_be_logged_in(event);
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    must_be_logged_in(event);

    await db.update(userTable).set({ active: false }).where(eq(userTable.id, event.locals.user.id));
    await invalidate_all_user_sessions(event);
    redirect(
      302,
      '/',
      {
        type: 'success',
        title: 'Success',
        message: 'You have successfully deactivated your account.'
      },
      event
    );
  }
};
