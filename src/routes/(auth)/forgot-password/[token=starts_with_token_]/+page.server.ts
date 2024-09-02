import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

import { BASE_URL } from '$env/static/private';
import { cannot_be_logged_in } from '$lib/middleware/auth';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { lower, userTable } from '$lib/server/schema';
import { create_user_session } from '$lib/utils/auth';
import { send_mail } from '$lib/utils/email';
import {
  send_reset_password_email,
  tell_user_password_has_changed
} from '$lib/utils/email/actions';
import { new_id } from '$lib/utils/id';
import { Argon2id } from '$lib/utils/password';
import { create_user_token } from '$lib/utils/user';

export const load: PageServerLoad = async (event) => {
  cannot_be_logged_in(event);

  return { form: await superValidate(valibot(schema)) };
};

export const actions: Actions = {
  default: async (event) => {
    cannot_be_logged_in(event);

    const form = await superValidate(event.request, valibot(schema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const user = (
      await db
        .select({ token_expiration: userTable.token_expiration, id: userTable.id })
        .from(userTable)
        .where(eq(userTable.token, event.params.token))
        .limit(1)
    )[0];
    if (!user) {
      return redirect(
        302,
        '/token/new?token-type=reset-password',
        {
          type: 'error',
          title: 'User not found',
          message: 'No user was found with a token matching that value'
        },
        event
      );
    }
    if (!user.token_expiration || (user.token_expiration && user.token_expiration < new Date())) {
      const token = await create_user_token(user.email);
      send_reset_password_email({ token, email: user.email });

      return redirect(
        302,
        '/forgot-password/confirm',
        {
          type: 'error',
          title: 'Token Expired',
          message: 'That token has expired. A new one has been emailed to you.',
          timeout: 15000
        },
        event
      );
    }

    const hashed_password = await new Argon2id().hash(form.data.password);
    await db
      .update(userTable)
      .set({ hashed_password, token: '', token_expiration: null })
      .where(eq(userTable.token, event.params.token));
    tell_user_password_has_changed(user.email);
    await create_user_session({ user_id: user.id, event });
    redirect(
      302,
      '/',
      {
        type: 'success',
        title: 'Password updated',
        message: 'Your password has been updated and you have been logged in.'
      },
      event
    );
  }
};
