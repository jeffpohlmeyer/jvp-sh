import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema';
import { type EmailDataType, send_mail } from '$lib/utils/email';
import { validate } from '$lib/utils/form';

import { schema } from './util';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }

  return {
    email: '',
    token_type: (url.searchParams.get('token-type') ?? 'activation') as
      | 'activation'
      | 'reset-password'
  };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email?.toString()?.trim().toLowerCase();
    const form_data: { email: string; token_type: string } = {
      email,
      token_type: formData.token_type?.toString()?.trim().toLowerCase()
    };
    const { valid, errors } = validate<{ email: string; token_type: string }>({
      schema_object: schema,
      state_object: form_data
    });
    if (!valid) {
      return fail(400, { errors, email });
    }
    const token_type: 'activation' | 'reset-password' = form_data.token_type.toString() as
      | 'activation'
      | 'reset-password';
    const user_result = await db
      .select({ user_id: user.id })
      .from(user)
      .where(eq(user.email, email));
    if (!user_result.length) {
      return fail(404, {
        ...form_data,
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
        ...form_data,
        error: 'token-not-created',
        message: 'An error occurred while creating a token. Please try again.'
      });
    }
    const _token = token_result[0];

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
