import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';

export const load: PageServerLoad = async ({ params }) => {
  const { url: _url } = params;
  if (!_url) {
    throw redirect(301, '/');
  }

  const is_plus = _url.at(-1) === '+';

  let url: string = _url;
  if (is_plus) {
    url = url.substring(0, url.length - 1);
  }

  const result = await db.select().from(urls).where(eq(urls.endpoint, url));
  const _redirect = result[0]?.redirect_link;
  if (_redirect && !is_plus) {
    await db
      .update(urls)
      .set({ clicked: (result[0]?.clicked ?? 0) + 1 })
      .where(eq(urls.id, result[0].id));
    throw redirect(301, _redirect);
  }
  return { result: result[0] };
};
