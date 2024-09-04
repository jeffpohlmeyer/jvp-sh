import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './util';

import { cannot_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { lower, userTable } from '$lib/server/schema';
import { send_activate_account_email, send_reset_password_email } from '$lib/utils/email/actions';
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
    const token_type: 'confirm' | 'reset-password' = event.url.searchParams.get('token-type') as
      | 'confirm'
      | 'reset-password';
    if (!['confirm', 'reset-password'].includes(token_type)) {
      return message(form, {
        type: 'error',
        title: 'Error',
        text: 'That is an invalid token request type.'
      });
    }
    const user = (
      await db
        .select({ user_id: userTable.id })
        .from(userTable)
        .where(eq(lower(userTable.email), form.data.email))
        .limit(1)
    )[0];
    if (!user) {
      return message(form, {
        type: 'error',
        title: 'Error',
        text: 'That email address is not associated with any account.'
      });
    }
    const token = await create_user_token(form.data.email.toLowerCase());
    if (token_type === 'confirm') {
      send_activate_account_email({ token, email: form.data.email.toLowerCase() });
    } else if (token_type === 'reset-password') {
      send_reset_password_email({ token, email: form.data.email.toLowerCase() });
    }

    redirect(302, '/token/new/confirm');
  }
};
