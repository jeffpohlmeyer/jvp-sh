import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export function must_be_logged_in<E extends ServerLoadEvent | RequestEvent>(event: E) {
  const { locals, url } = event;
  if (!locals.user?.id) {
    throw redirect(
      302,
      `/login?redirect=${url.pathname}`,
      { type: 'warning', message: 'You need to be logged in to access that page.' },
      event
    );
  }
  return true;
}
