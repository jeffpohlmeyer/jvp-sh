import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema';

import { schema } from './utils';
import { validate } from '$lib/utils/form';
import { send_mail } from '$lib/utils/email';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }

  return { email: url.searchParams.get('email') };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email?.toString()?.trim().toLowerCase();
    const { valid, errors } = validate({ schema_object: schema, state_object: formData });
    if (!valid) {
      return fail(400, { errors, email });
    }

    const user_result = await db
      .select({ user_id: user.id })
      .from(user)
      .where(eq(user.email, email));
    if (!user_result.length) {
      return fail(404, {
        error: 'account-not-found',
        message: 'An account with that email could not be found.',
        ...formData
      });
    }
    try {
      await db
        .delete(token)
        .where(and(eq(token.user_id, user_result[0].user_id), eq(token.token_type, 'activation')));
      const token_result = await db
        .insert(token)
        .values({ user_id: user_result[0].user_id, token_type: 'activation' })
        .returning({ id: token.id });
      if (token_result.length > 0) {
        const _token = token_result[0];
        const link = `${url.origin}/token/${_token.id}/activation`;
        const to = email;
        const subject = 'Activate your account';
        const text = `Click the link to activate your account: ${link}`;
        const title = 'Activate your account';
        const body = `
          <h1>New Account</h1>
          <p>A new account has been created at <a href="${url.origin}">${url.origin}</a> using this email address.</p>
          <p>Please follow <a href="${link}">this link</a> to complete the registration process.</p>
          <p>If the link does not work please copy and paste this link into the browser: ${link}</p>
          <p>Thanks,</p>
          <p>The team at jvp.sh</p>
        `;
        await send_mail({ to, subject, text, html: { title, body } });
      }
    } catch (err) {
      console.log('err', err);
      return fail(500, { ...formData, error: 'unknown', message: 'An unknown error occurred' });
    }
    throw redirect(302, '/login/inactive/confirm');
  }
};
