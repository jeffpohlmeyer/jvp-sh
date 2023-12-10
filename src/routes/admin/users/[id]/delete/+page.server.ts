import type { Actions, PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { session, urls, user } from '$lib/server/schema';

import { check_admin_user } from '$lib/middleware/admin';
import { must_be_logged_in } from '$lib/middleware/auth';

export const load: PageServerLoad = async (event) => {
  must_be_logged_in(event);
  check_admin_user(event);
  const { locals, params } = event;
  const { id } = params;
  if (id === locals?.user?.id) {
    throw redirect(
      302,
      '/admin/users',
      { type: 'error', message: 'You cannot delete your own account from here.' },
      event
    );
  }
  const user_result = await db.select().from(user).where(eq(user.id, id));
  if (!user_result.length) {
    throw redirect(
      302,
      '/admin/users',
      { type: 'error', message: 'That user was not found' },
      event
    );
  }
  const _user = user_result[0];
  if (_user.is_admin) {
    throw redirect(
      302,
      '/admin/users',
      {
        type: 'error',
        message: 'You cannot delete an admin user. Please remove their admin rights first.'
      },
      event
    );
  }
  return { user: _user };
};

export const actions: Actions = {
  default: async (event) => {
    must_be_logged_in(event);
    check_admin_user(event);
    const { locals, params } = event;
    const { id } = params;
    if (id === locals?.user?.id) {
      throw redirect(
        302,
        '/admin/users',
        { type: 'error', message: 'You cannot delete your own account from here.' },
        event
      );
    }
    const user_result = await db.select().from(user).where(eq(user.id, id));
    if (!user_result.length) {
      throw redirect(
        302,
        '/admin/users',
        { type: 'error', message: 'That user was not found' },
        event
      );
    }
    const _user = user_result[0];
    if (_user.is_admin) {
      throw redirect(
        302,
        '/admin/users',
        {
          type: 'error',
          message: 'You cannot delete an admin user. Please remove their admin rights first.'
        },
        event
      );
    }
    await db.transaction(async (tx) => {
      await tx.update(urls).set({ user_id: null }).where(eq(urls.user_id, id));
      await tx.delete(session).where(eq(session.user_id, id));
      await tx.delete(user).where(eq(user.id, id));
    });
    throw redirect(
      302,
      '/admin/users',
      {
        type: 'success',
        message: `You have successfully deleted user ${_user.email}`
      },
      event
    );
  }
};
