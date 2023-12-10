import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export function check_admin_user<E extends ServerLoadEvent | RequestEvent>(event: E) {
  const { locals } = event;
  if (!locals.user?.is_admin) {
    throw redirect(302, '/', { type: 'error', message: 'You are not allowed to be there' }, event);
  }

  return {};
}
