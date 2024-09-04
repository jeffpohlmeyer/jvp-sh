import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

import { must_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema';
import { tell_user_password_has_changed } from '$lib/utils/email/actions';
import { Argon2id } from '$lib/utils/password';

export const load: PageServerLoad = async (event) => {
  must_be_logged_in(event);

  return { form: await superValidate(valibot(schema)) };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event.request, valibot(schema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const valid_password = await new Argon2id().verify(
      event.locals.user.hashed_password!,
      form.data.current_password
    );
    if (!valid_password) {
      return message(form, {
        type: 'error',
        title: 'Error',
        text: 'Your current password is incorrect.'
      });
    }

    const hashed_password = await new Argon2id().hash(form.data.new_password);
    await db
      .update(userTable)
      .set({ hashed_password })
      .where(eq(userTable.id, event.locals.user.id));
    tell_user_password_has_changed(event.locals.user.email);

    redirect(
      302,
      '/account',
      { type: 'success', message: 'Your password has been changed' },
      event
    );
  }
};
