import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

import { check_admin_user } from '$lib/middleware/admin';
import { db } from '$lib/server/db';
import { lower, userTable } from '$lib/server/schema';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);
  return { form: await superValidate(valibot(schema)) };
};

export const actions: Actions = {
  default: async (event) => {
    check_admin_user(event);
    const form = await superValidate(event.request, valibot(schema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const result = await db
      .select()
      .from(userTable)
      .where(eq(lower(userTable.email), form.data.email.toLowerCase()));
    if (result.length > 0) {
      setFlash({ type: 'error', message: 'An account with that email already exists' }, event);
      return fail(400, { form });
    }

    await db.insert(userTable).values({
      email: form.data.email,
      is_admin: form.data.is_admin,
      active: form.data.active,
      password_reset_required: true
    });
    redirect(
      302,
      '/admin/users',
      { type: 'success', message: `User ${form.data.email} successfully created` },
      event
    );
  }
};
