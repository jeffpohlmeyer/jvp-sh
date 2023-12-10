import type { Actions, PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';

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
      { type: 'error', message: 'You cannot change your own status here.' },
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
  return { user: user_result[0] };
};

export const actions: Actions = {
  default: async (event) => {
    must_be_logged_in(event);
    check_admin_user(event);
    const { locals, params, request } = event;
    const { id } = params;
    if (id === locals?.user?.id) {
      throw redirect(
        302,
        '/admin/users',
        { type: 'error', message: 'You cannot change your own status here.' },
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
    const formData = Object.fromEntries(await request.formData());
    const active: boolean = !!formData.active ?? false;
    await db.update(user).set({ active }).where(eq(user.id, id));
    throw redirect(
      302,
      '/admin/users',
      {
        type: 'success',
        message: `You have successfully updated user ${user_result[0].email}.`
      },
      event
    );
  }
};
