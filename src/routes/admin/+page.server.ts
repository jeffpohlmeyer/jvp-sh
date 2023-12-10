import type { PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';
import { must_be_logged_in } from '$lib/middleware/auth';

export const load: PageServerLoad = (event) => {
  must_be_logged_in(event);
  return check_admin_user(event);
};
