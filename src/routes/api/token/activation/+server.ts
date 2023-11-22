import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { eq, and } from 'drizzle-orm';

import { create_session, set_cookie } from '$lib/utils/auth';
import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema-postgres';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const form_data = await request.formData();
  const token_value = form_data.get('token');

  let error_message: string = '';
  if (token_value) {
    try {
      const _token = token_value.toString();
      const token_result = await db.select().from(token).where(eq(token.id, _token));
      if (token_result.length > 0) {
        const { user_id, expires, token_type } = token_result[0];
        if (!expires || expires < new Date()) {
          error_message = 'expired-token~~That activation token has expired.';
        } else if (!user_id) {
          error_message =
            'user-not-found~~That activation token does not have a user associated with it.';
        } else {
          await db.update(user).set({ active: true }).where(eq(user.id, user_id));
          await db
            .delete(token)
            .where(and(eq(token.user_id, user_id), eq(token.token_type, token_type!)));
          try {
            const session = await create_session(user_id);
            await set_cookie({ cookies, session });
          } catch (err) {
            console.log('cookie error', err);
            error_message = 'cookie-error~~There was an error setting your cookie.';
          }
        }
      } else {
        error_message = 'token-not-found~~That token could not be found.';
      }
    } catch (err: never) {
      if (err.code === '22P02') {
        error_message = 'invalid-token~~That token type is not valid.';
      } else {
        console.log('err', err);
        error_message = 'server-error~~There was an error activating your account.';
      }
    }
  }

  if (error_message) {
    const [_error, message] = error_message.split('~~');
    throw error(400, { error: _error, message });
  }
  return new Response(null, { status: 204 });
};
