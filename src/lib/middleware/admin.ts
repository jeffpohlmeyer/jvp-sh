import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';

import { must_be_logged_in } from '$lib/middleware/auth';

export function check_admin_user<E extends ServerLoadEvent | RequestEvent>(event: E) {
  must_be_logged_in(event);
  const { locals } = event;
  if (!locals.user?.is_admin) {
    throw redirect(302, '/', { type: 'error', message: 'You are not allowed to be there' }, event);
  }

  return {};
}
