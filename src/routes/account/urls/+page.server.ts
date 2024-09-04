import { eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

import { must_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { urlsTable } from '$lib/server/schema';
import type { URLsType } from '$lib/server/schema/postgres';

export const load: PageServerLoad = async (event) => {
  must_be_logged_in(event);

  return {
    urls: (await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.user_id, event.locals.user.id))) as unknown as URLsType[]
  };
};
