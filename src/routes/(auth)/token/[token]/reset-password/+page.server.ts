import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { create_session, hash, set_cookie } from '$lib/utils/auth';
import { user, token } from '$lib/server/schema-postgres';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }

  const form = await superValidate(schema);

  return { form };
};

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const hashed_password = await hash(form.data.password);
    const token_result = await db.select().from(token).where(eq(token.id, form.data.token));
    if (!token_result.length) {
      return fail(404, {
        form,
        error: 'token-not-found',
        message: 'That token could not be found.'
      });
    }
    const _token = token_result[0];
    if (_token.token_type !== 'reset-password') {
      return fail(400, { form, error: 'invalid-token', message: 'That token type is not valid.' });
    }
    if (_token.expires < new Date()) {
      return fail(400, { form, error: 'expired-token', message: 'That token has expired.' });
    }
    const user_result = await db
      .update(user)
      .set({ hashed_password })
      .where(eq(user.id, _token.user_id))
      .returning({ user_id: user.id });
    if (!user_result.length) {
      return fail(404, {
        form,
        error: 'user-not-found',
        message: 'That token does not have a user associated with it.'
      });
    }
    const _user = user_result[0];
    await db
      .delete(token)
      .where(and(eq(token.token_type, 'reset-password'), eq(token.user_id, _user.user_id)));
    const session = await create_session(_user.user_id);
    await set_cookie({ cookies, session });

    return { form };
  }
};
