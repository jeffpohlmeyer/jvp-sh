import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

import { BASE_URL } from '$env/static/private';
import { cannot_be_logged_in } from '$lib/middleware/auth';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { lower, userTable } from '$lib/server/schema';
import type { Message } from '$lib/types/super-forms';
import { create_user_session } from '$lib/utils/auth';
import { send_mail } from '$lib/utils/email';
import { send_reset_password_email } from '$lib/utils/email/actions';
import { new_id } from '$lib/utils/id';
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

    const _message: Message = { type: 'error', title: 'Error', text: '' };

    const user = (
      await db
        .select()
        .from(userTable)
        .where(eq(lower(userTable.email), form.data.email.toLowerCase()))
        .limit(1)
    )[0];
    let valid_password = false;
    if (user) {
      if (user.password_reset_required) {
        const token = await create_user_token(form.data.email.toLowerCase());
        send_reset_password_email({ token, email: form.data.email.toLowerCase() });

        return redirect(301, '/password-reset-required');
      }
      valid_password = await new Argon2id().verify(user.hashed_password!, form.data.password);
      if (valid_password) {
        if (!user?.active) {
          let url = '/login/inactive';
          url += `?email=${encodeURIComponent(form.data.email.toLowerCase())}`;
          return redirect(302, url);
        } else {
          await create_user_session({ user_id: user.id, event });
        }
      } else {
        _message.text = 'Invalid email or password';
      }
    } else {
      _message.text = 'Invalid email or password';
    }
    if (_message.text) {
      return message(form, _message);
    }

    let _redirect = '/';
    if (event.url.searchParams.has('redirect')) {
      _redirect = event.url.searchParams.get('redirect')!;
    }
    redirect(
      302,
      _redirect,
      {
        title: 'Login Success',
        message: 'You have successfully logged in',
        type: 'success'
      },
      event
    );
  }
};
