import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { AUTH_TOKEN_NAME } from '$env/static/private';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { session } from '$lib/server/schema-postgres';

export async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

type InvalidateSessionPayloadType = {
  user_id?: string;
  session_id?: string;
};

export async function invalidate_sessions(payload: InvalidateSessionPayloadType): Promise<void> {
  const { user_id, session_id } = payload;
  if (!user_id && !session_id) {
    throw new Error('user_id or session_id is required');
  }
  if (user_id) {
    await db.delete(session).where(eq(session.user_id, user_id));
    return;
  }
  if (session_id) {
    await db.delete(session).where(eq(session.id, session_id));
    return;
  }
}

type SessionType = {
  id: string;
  user_id: string;
  expires: Date;
};
export async function create_session(user_id: string): Promise<SessionType> {
  await invalidate_sessions({ user_id });
  const session_result = await db
    .insert(session)
    .values({ user_id })
    .returning({ id: session.id, user_id: session.user_id, expires: session.expires });
  if (!session_result.length) {
    throw new Error('session could not be created');
  }
  const result = session_result[0];
  if (!result.id || !result.user_id || !result.expires) {
    throw new Error('session could not be created');
  }
  return result as SessionType;
}

type SetCookiePayloadType = {
  cookies: Cookies;
  session: SessionType;
};

export async function set_cookie(payload: SetCookiePayloadType): Promise<void> {
  const { cookies, session } = payload;
  if (!cookies) {
    throw new Error('cookie input is required');
  }
  if (!session) {
    throw new Error('session is required');
  }
  cookies.set(AUTH_TOKEN_NAME, session.id, {
    // send cookie for every page
    path: '/',
    // server side only cookie so you can't use `document.cookie`
    httpOnly: true,
    // only requests from same site can send cookies
    // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
    sameSite: 'strict',
    // only sent over HTTPS in production
    secure: !dev,
    // set cookie to expire when session expires
    expires: session.expires
  });
  return;
}
