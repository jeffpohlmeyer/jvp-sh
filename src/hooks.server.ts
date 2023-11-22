// import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { session, user } from '$lib/server/schema-postgres';

export type UserReturnType = {
  id: string;
  email: string;
  created_at: Date;
  active: boolean;
};

export const handle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware
  // event.locals.auth = auth.handleRequest(event);
  // console.log('event', event);
  const { cookies } = event;

  const auth_cookie = cookies.get('jvp-sh-session');
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
            active: user.active
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
