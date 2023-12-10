import type { Handle } from '@sveltejs/kit';
import { AUTH_TOKEN_NAME } from '$env/static/private';

import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { session, user } from '$lib/server/schema';

export type UserReturnType = {
  id: string;
  email: string;
  created_at: Date;
  active: boolean;
  is_admin: boolean;
};

export const handle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware
  // event.locals.auth = auth.handleRequest(event);
  // console.log('event', event);
  const { cookies } = event;

  const auth_cookie = cookies.get(AUTH_TOKEN_NAME);
  if (auth_cookie) {
    const session_result = await db.select().from(session).where(eq(session.id, auth_cookie));
    if (session_result.length) {
      const { user_id } = session_result[0];
      if (user_id) {
        const user_result = await db
          .select({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            active: user.active,
            is_admin: user.is_admin
          })
          .from(user)
          .where(eq(user.id, user_id));
        if (user_result.length) {
          event.locals.user = user_result[0];
        }
      }
    }
  }
  return resolve(event);
};
