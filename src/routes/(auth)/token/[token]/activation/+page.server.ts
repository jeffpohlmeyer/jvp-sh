import type { PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { token, user } from '$lib/server/schema';
import { create_session, set_cookie } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
  const { cookies, locals, params } = event;
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }
  const { token: _token } = params;
  if (!_token) {
    throw redirect(
      302,
      '/token/new/token-type=activation',
      { type: 'error', message: 'Token needs to be included.' },
      event
    );
  }
  const redirect_object: {
    url: string;
    message: { type: 'success' | 'error' | 'warning'; message: string };
  } = {
    url: '/token/new?token-type=activation',
    message: {
      type: 'error',
      message: ''
    }
  };
  try {
    const token_result = await db.select().from(token).where(eq(token.id, _token));
    if (!token_result.length) {
      redirect_object.message = { type: 'error', message: 'Token not found.' };
    } else {
      const { user_id, expires, token_type } = token_result[0];
      if (!expires || expires < new Date()) {
        redirect_object.message = { type: 'error', message: 'That activation token has expired.' };
      } else if (!user_id) {
        redirect_object.message = {
          type: 'error',
          message: 'That activation token does not have a user associated with it.'
        };
      } else {
        await db.update(user).set({ active: true }).where(eq(user.id, user_id));
        await db
          .delete(token)
          .where(and(eq(token.user_id, user_id), eq(token.token_type, token_type!)));
        try {
          const session = await create_session(user_id);
          await set_cookie({ cookies, session });
          redirect_object.url = '/';
          redirect_object.message = {
            type: 'success',
            message: 'Your account has been activated.'
          };
        } catch (err) {
          redirect_object.url = '/login';
          redirect_object.message = {
            type: 'error',
            message: 'There was an error setting your cookie.'
          };
        }
      }
    }
  } catch (err) {
    if (err.code === '22P02') {
      redirect_object.message = { type: 'error', message: 'That token type is not valid.' };
    } else {
      console.log('err', err);
      redirect_object.message = {
        type: 'error',
        message: 'There was an error activating your account.'
      };
    }
  }

  throw redirect(302, redirect_object.url, redirect_object.message, event);
};
