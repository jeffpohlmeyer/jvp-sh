import type { PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);

  return {
    users: await db
      .select({
        id: userTable.id,
        email: userTable.email,
        created_at: userTable.created_at,
        active: userTable.active,
        is_admin: userTable.is_admin
      })
      .from(userTable)
  };
};
