import { type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';

import { lucia } from '$lib/server/auth';

type EventType = (E & ServerLoadEvent) | RequestEvent;

type CreateUserSessionPayloadType = {
  user_id: string;
  event: EventType;
  invalidate_old_sessions: boolean;
};
export async function create_user_session({
  user_id,
  event,
  invalidate_old_sessions
}: CreateUserSessionPayloadType) {
  if (invalidate_old_sessions) {
    if (event.locals.session) {
      await lucia.invalidateSession(event.locals.session.id);
    }
    await lucia.invalidateUserSessions(user_id);
  }
  const newSession = await lucia.createSession(user_id, {});
  const sessionCookie = lucia.createSessionCookie(newSession.id);
  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    path: '.',
    ...sessionCookie.attributes
  });
}

export async function invalidate_all_user_sessions(event: EventType) {
  await lucia.invalidateSession(event.locals.session?.id as string);
  await lucia.invalidateUserSessions(event.locals.user.id);
  const blankCookie = lucia.createBlankSessionCookie();
  event.cookies.set(blankCookie.name, blankCookie.value, {
    path: '.',
    ...blankCookie.attributes
  });
}
