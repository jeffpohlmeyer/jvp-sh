import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';

import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema-postgres';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }
  const form = await superValidate(schema);
  if (url.searchParams.get('email')) {
    form.data.email = url.searchParams.get('email')!;
  }

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }
    const email = form.data.email.trim().toLowerCase();
    const user_result = await db
      .select({ user_id: user.id })
      .from(user)
      .where(eq(user.email, email));
    if (!user_result.length) {
      return fail(404, { form, error: 'An account with that email could not be found.' });
    }
    // await db
    //   .delete(token)
    //   .where(and(eq(token.user_id, user_result[0].user_id), eq(token.token_type, 'activation')));
    const token_result = await db
      .insert(token)
      .values({ user_id: user_result[0].user_id, token_type: 'activation' })
      .returning({ id: token.id });
    if (!token_result.length) {
      return fail(500, { form, error: 'There was an error creating your token.' });
    }
    const token_id = token_result[0].id;
    // send email

    throw redirect(302, '/login/inactive/confirm');
  }
};
