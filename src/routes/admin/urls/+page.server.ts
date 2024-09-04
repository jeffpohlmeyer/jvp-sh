import type { PageServerLoad } from './$types';

import { check_admin_user } from '$lib/middleware/admin';
import { db } from '$lib/server/db';
import { urlsTable, userTable } from '$lib/server/schema';
import type { UrlWithEmailType } from '$lib/server/schema/postgres';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);

  const user_result = await db.select({ id: userTable.id, email: userTable.email }).from(userTable);
  const user_lookup: { [key: string]: string } = {};
  for (const u of user_result) {
    user_lookup[u.id] = u.email;
  }
  return {
    urls: (await db.select().from(urlsTable)).map((u) => {
      const payload: UrlWithEmailType = { ...u };
      if (u.user_id) {
        payload.email = user_lookup[u.user_id];
      }
      return payload;
    })
  };
};
