import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';

import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/server/db';
import { hash } from '$lib/utils/auth';
import { send_mail } from '$lib/utils/email';
import { user, token } from '$lib/server/schema-postgres';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
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

    const email = form.data.email.trim().toLowerCase();
    const result = await db.select().from(user).where(eq(user.email, email));
    if (result.length > 0) {
      return fail(401, {
        form,
        error: 'duplicate-account',
        message: 'An account with that email already exists'
      });
    }

    try {
      const hashed_password = await hash(form.data.password);
      const new_user_result = await db
        .insert(user)
        .values({ email, hashed_password })
        .returning({ user_id: user.id });
      if (new_user_result.length > 0) {
        const new_user = new_user_result[0];
        const { user_id } = new_user;
        const token_result = await db
          .insert(token)
          .values({ user_id, token_type: 'activation' })
          .returning({ id: token.id });
        if (token_result.length > 0) {
          const _token = token_result[0];
          // send email
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
      }
    } catch (err) {
      console.log('err', err);
      if (err.code === '23505') {
        return fail(400, {
          form,
          error: 'duplicate-account',
          message: 'An account with that email already exists'
        });
      } else {
        return fail(500, { form, error: 'unknown', message: 'An unknown error occurred' });
      }
    }

    throw redirect(302, '/register/confirm');
  }
};
