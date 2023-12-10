import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { hash } from '$lib/utils/auth';
import { send_mail } from '$lib/utils/email';
import { user, token } from '$lib/server/schema';
import { type UseZodPayloadType, validate } from '$lib/utils/form';

import { schema, object_refine } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }
  return { email: '', password: '', confirm_password: '' };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, url } = event;
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email?.toString()?.trim().toLowerCase();
    const { valid, errors } = validate<{
      email: string;
      password: string;
      confirm_password: string;
    }>({
      schema_object: schema,
      state_object: formData,
      object_refine
    } as UseZodPayloadType);
    if (!valid) {
      return fail(400, { errors, email });
    }

    const result = await db.select().from(user).where(eq(user.email, email));
    if (result.length > 0) {
      setFlash({ type: 'error', message: 'An account with that email already exists' }, event);
      return fail(400, {
        email,
        password: '',
        confirm_password: '',
        error: 'duplicate-account'
      });
    }

    try {
      const hashed_password = await hash(formData.password.toString());
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
        setFlash({ type: 'error', message: 'An account with that email already exists' }, event);
        return fail(400, {
          email,
          error: 'duplicate-account'
        });
      } else {
        setFlash({ type: 'error', message: 'An unknown error occurred' }, event);

        return fail(500, { email, error: 'unknown' });
      }
    }

    throw redirect(302, '/register/confirm');
  }
};
