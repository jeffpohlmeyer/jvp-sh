import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema-postgres';
import { type EmailDataType, send_mail } from '$lib/utils/email';

import { schema } from './util';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }

  const form = await superValidate(schema);
  form.data.token_type = (url.searchParams.get('token-type') ?? 'activation') as
    | 'activation'
    | 'reset-password';

  return { form };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const email = form.data.email.trim().toLowerCase();
    const token_type = form.data.token_type;
    const user_result = await db
      .select({ user_id: user.id })
      .from(user)
      .where(eq(user.email, email));
    if (!user_result.length) {
      return fail(404, {
        form,
        error: 'user-not-found',
        message: 'That email address is not associated with any account.'
      });
    }
    const _user = user_result[0];
    const token_result = await db
      .insert(token)
      .values({ user_id: _user.user_id, token_type })
      .returning({ id: token.id });
    if (!token_result.length) {
      return fail(500, {
        form,
        error: 'token-not-created',
        message: 'An error occurred while creating a token. Please try again.'
      });
    }
    const _token = token_result[0];

    // send email
    const link = `${url.origin}/token/${_token.id}/${token_type}`;
    const to = email;

    const email_data: { [key in 'activation' | 'reset-password']: EmailDataType } = {
      activation: {
        to,
        subject: 'Activate your account',
        text: `Click the link to activate your account: ${link}`,
        html: {
          title: 'Activate your account',
          body: `
          <h1>New Account</h1>
          <p>A new account has been created at <a href="${url.origin}">${url.origin}</a> using this email address.</p>
          <p>Please follow <a href="${link}">this link</a> to complete the registration process.</p>
          <p>If the link does not work please copy and paste this link into the browser: ${link}</p>
          <p>Thanks,</p>
          <p>The team at jvp.sh</p>
        `
        }
      },
      'reset-password': {
        to,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${link}`,
        html: {
          title: 'Reset your password',
          body: `
          <h1>Reset Password</h1>
          <p>A request has been made to reset the password for your account at <a href="${url.origin}">${url.origin}</a> using this email address.</p>
          <p>Please follow <a href="${link}">this link</a> to reset your password.</p>
          <p>If the link does not work please copy and paste this link into the browser: ${link}</p>
          <p>Thanks,</p>
          <p>The team at jvp.sh</p>
        `
        }
      }
    };
    await send_mail(email_data[token_type]);

    const _redirect =
      token_type === 'activation' ? '/register/confirm' : '/forgot-password/confirm';
    throw redirect(302, _redirect);
  }
};
