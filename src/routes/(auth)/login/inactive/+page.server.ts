import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

import { BASE_URL } from '$env/static/private';
import { cannot_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { lower, userTable } from '$lib/server/schema';
import { send_mail } from '$lib/utils/email';
import { send_activate_account_email } from '$lib/utils/email/actions';
import { new_id } from '$lib/utils/id';
import { create_user_token } from '$lib/utils/user';

export const load: PageServerLoad = async (event) => {
  cannot_be_logged_in(event);

  return {
    form: await superValidate({ email: event.url.searchParams.get('email')! }, valibot(schema))
  };
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
        .select({ user_id: userTable.id })
        .from(userTable)
        .where(eq(userTable.email, form.data.email))
        .limit(1)
    )[0];
    if (!user) {
      return message(form, {
        type: 'error',
        title: 'Error',
        text: 'An account with that email could not be found'
      });
    }
    const token = await create_user_token(form.data.email.toLowerCase());
    send_activate_account_email({ token, email: form.data.email.toLowerCase() });

    redirect(302, '/login/inactive/confirm');
  }
};
