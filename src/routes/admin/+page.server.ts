import type { PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';

export const load: PageServerLoad = (event) => {
  return check_admin_user(event);
};
