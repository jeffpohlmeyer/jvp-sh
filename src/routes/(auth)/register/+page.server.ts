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

    const hashed_password = await new Argon2id().hash(form.data.password);
    const existingUser = (
      await db
        .select()
        .from(userTable)
        .where(eq(lower(userTable.email), form.data.email.toLowerCase()))
        .limit(1)
    )[0];
    if (existingUser) {
      return message(form, {
        type: 'error',
        text: `A user with email ${form.data.email} already exists.`
      });
    }
    const token = await create_user_token(form.data.email.toLowerCase(), { hashed_password });

    await db.insert(userTable).values({
      email: form.data.email.toLowerCase(),
      hashed_password,
      token,
      token_expiration: new Date(Date.now() + 60 * 60 * 1000)
    });
    send_activate_account_email({ token, email: form.data.email.toLowerCase() });

    redirect(302, '/register/confirm');
  }
};
