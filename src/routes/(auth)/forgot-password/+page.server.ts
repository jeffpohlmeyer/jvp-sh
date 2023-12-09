import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema';
import { validate } from '$lib/utils/form';
import { send_mail } from '$lib/utils/email';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }

  return { email: '' };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const formData = Object.fromEntries(await request.formData());
    const { valid, errors } = validate<{ email: string }>({
      schema_object: schema,
      state_object: formData
    });
    if (!valid) {
      return fail(400, { errors, ...formData });
    }

    try {
      const email = formData.email.toString().trim().toLowerCase();
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
        ...formData,
        error: 'token-not-created',
        message: 'An error occurred while creating a token. Please try again.'
      });
    }

    throw redirect(302, '/forgot-password/confirm');
  }
};
