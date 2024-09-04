import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';
import { db } from '$lib/server/db';
import { sessionTable, urlsTable, userTable } from '$lib/server/schema';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);
  const { locals, params } = event;
  const { id } = params;
  if (id === locals?.user?.id) {
    redirect(
      302,
      '/admin/users',
      { type: 'error', message: 'You cannot delete your own account from here.' },
      event
    );
  }
  const user = (await db.select().from(userTable).where(eq(userTable.id, id)).limit(1))[0];
  if (!user) {
    redirect(302, '/admin/users', { type: 'error', message: 'That user was not found' }, event);
  }
  if (user.is_admin) {
    redirect(
      302,
      '/admin/users',
      {
        type: 'error',
        message: 'You cannot delete an admin user. Please remove their admin rights first.'
      },
      event
    );
  }
  return { user };
};

export const actions: Actions = {
  default: async (event) => {
    check_admin_user(event);
    const { locals, params } = event;
    const { id } = params;
    if (id === locals?.user?.id) {
      redirect(
        302,
        '/admin/users',
        { type: 'error', message: 'You cannot delete your own account from here.' },
        event
      );
    }
    const user = (await db.select().from(userTable).where(eq(userTable.id, id)).limit(1))[0];
    if (!user) {
      redirect(302, '/admin/users', { type: 'error', message: 'That user was not found' }, event);
    }
    if (user.is_admin) {
      redirect(
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
      await tx.update(urlsTable).set({ user_id: null }).where(eq(urlsTable.user_id, id));
      await tx.delete(sessionTable).where(eq(sessionTable.id, id));
      await tx.delete(userTable).where(eq(userTable.id, id));
    });
    redirect(
      302,
      '/admin/users',
      {
        type: 'success',
        message: `You have successfully deleted user ${user.email}`
      },
      event
    );
  }
};
