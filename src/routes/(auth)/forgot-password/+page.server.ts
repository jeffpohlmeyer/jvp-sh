import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema-postgres';

import { schema } from './utils';
import { send_mail } from '$lib/utils/email';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }
  const form = await superValidate(schema);

  return { form };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const email = form.data.email.trim().toLowerCase();
      const user_result = await db
        .select({ user_id: user.id })
        .from(user)
        .where(eq(user.email, email));
      if (user_result.length > 0) {
        const token_result = await db
          .insert(token)
          .values({ user_id: user_result[0].user_id, token_type: 'reset-password' })
          .returning({ id: token.id });
        if (token_result.length > 0) {
          const token_id = token_result[0].id;
          const link = `${url.origin}/token/${token_id}/reset-password`;
          const to = email;
          const subject = 'Reset your password';
          const text = `Click the link to reset your password: ${link}`;
          const title = 'Reset your password';
          const body = `
          <h1>Reset Password</h1>
          <p>A request has been made to reset the password for your account at <a href="${url.origin}">${url.origin}</a> using this email address.</p>
          <p>Please follow <a href="${link}">this link</a> to reset your password.</p>
          <p>If the link does not work please copy and paste this link into the browser: ${link}</p>
          <p>Thanks,</p>
          <p>The team at jvp.sh</p>
        `;
          await send_mail({ to, subject, text, html: { title, body } });
        }
      }
    } catch (err) {
      console.log('err', err);
      return fail(500, {
        form,
        error: 'token-not-created',
        message: 'An error occurred while creating a token. Please try again.'
      });
    }

    throw redirect(302, '/forgot-password/confirm');
  }
};
