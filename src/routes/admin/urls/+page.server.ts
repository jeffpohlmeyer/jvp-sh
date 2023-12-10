import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { urls, user } from '$lib/server/schema';

import { check_admin_user } from '$lib/middleware/admin';
import type { UrlWithEmailType } from '$lib/server/schema/types';

export const load: PageServerLoad = async (event) => {
  check_admin_user(event);

  const user_result = await db.select({ id: user.id, email: user.email }).from(user);
  const user_lookup: { [key: string]: string } = {};
  for (const u of user_result) {
    user_lookup[u.id] = u.email;
  }
  return {
    urls: (await db.select().from(urls)).map((u) => {
      const payload: UrlWithEmailType = { ...u };
      if (u.user_id) {
        payload.email = user_lookup[u.user_id];
      }
      return payload;
    })
  };
};
