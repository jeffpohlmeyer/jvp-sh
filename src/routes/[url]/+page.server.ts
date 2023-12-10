import type { PageServerLoad } from './$types';

import { desc, eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';

export const load: PageServerLoad = async (event) => {
  const { params } = event;
  const { url: _url } = params;
  if (!_url) {
    throw redirect(302, '/', { type: 'error', message: 'URL not found.' }, event);
  }

  const is_plus = _url.at(-1) === '+';

  let url: string = _url;
  if (is_plus) {
    url = url.substring(0, url.length - 1);
  }

  const result = await db
    .select()
    .from(urls)
    .where(eq(urls.endpoint, url))
    .orderBy(desc(urls.version));
  if (!result.length) {
    throw redirect(302, '/', { type: 'error', message: 'URL not found.' }, event);
  }
  const _redirect = result[0];
  const redirect_link = _redirect.redirect_link;
  if (_redirect && !is_plus) {
    await db
      .update(urls)
      .set({ clicked: (_redirect?.clicked ?? 0) + 1 })
      .where(eq(urls.id, _redirect.id));
    throw redirect(302, redirect_link);
  }
  return { ..._redirect };
};
