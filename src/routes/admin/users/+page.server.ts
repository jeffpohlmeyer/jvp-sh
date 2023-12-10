import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';

import { check_admin_user } from '$lib/middleware/admin';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);

  return {
    users: await db
      .select({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        active: user.active,
        is_admin: user.is_admin
      })
      .from(user)
  };
};
