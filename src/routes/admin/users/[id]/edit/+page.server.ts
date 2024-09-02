import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);
  const { locals, params } = event;
  const { id } = params;
  if (id === locals?.user?.id) {
    return redirect(
      302,
      '/admin/users',
      { type: 'error', message: 'You cannot change your own status here.' },
      event
    );
  }
  const user = (await db.select().from(userTable).where(eq(userTable.id, id)).limit(1))[0];
  if (!user) {
    return redirect(
      302,
      '/admin/users',
      { type: 'error', message: 'That user was not found' },
      event
    );
  }
  return { user };
};

export const actions: Actions = {
  default: async (event) => {
    check_admin_user(event);
    const { locals, params, request } = event;
    const { id } = params;
    if (id === locals?.user?.id) {
      redirect(
        302,
        '/admin/users',
        { type: 'error', message: 'You cannot change your own status here.' },
        event
      );
    }
    const user = (await db.select().from(userTable).where(eq(userTable.id, id)).limit(1))[0];
    if (!user) {
      redirect(302, '/admin/users', { type: 'error', message: 'That user was not found' }, event);
    }
    const formData = Object.fromEntries(await request.formData());
    const active: boolean = !!formData.active ?? false;
    await db.update(userTable).set({ active }).where(eq(userTable.id, id));
    redirect(
      302,
      '/admin/users',
      {
        type: 'success',
        message: `You have successfully updated user ${user.email}.`
      },
      event
    );
  }
};
