import type { PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';
import type { URLsType } from '$lib/server/schema/types';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  if (!locals?.user?.id) {
    throw redirect(
      302,
      `/login?redirect=${url.pathname}`,
      { type: 'warning', message: 'You need to be logged in to access that page.' },
      event
    );
  }
  return {
    urls: (await db
      .select()
      .from(urls)
      .where(eq(urls.user_id, locals.user.id))) as unknown as URLsType[]
  };
};
