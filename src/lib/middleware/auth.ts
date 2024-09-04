import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';

export function must_be_logged_in<E extends ServerLoadEvent | RequestEvent>(event: E) {
  const { locals, url } = event;
  if (!locals.user?.id) {
    return redirect(
      302,
      `/login?redirect=${url.pathname}`,
      { type: 'warning', message: 'You need to be logged in to access that page.' },
      event
    );
  }
  return true;
}

export function cannot_be_logged_in<E extends ServerLoadEvent | RequestEvent>(event: E) {
  const { locals } = event;
  if (locals.user?.id) {
    return redirect(302, '/', { type: 'warning', message: 'You are already logged in.' }, event);
  }
  return true;
}
