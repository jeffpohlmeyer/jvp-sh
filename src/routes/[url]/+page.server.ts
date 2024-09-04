import { redirect } from 'sveltekit-flash-message/server';
import { desc, eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { urlsTable } from '$lib/server/schema';

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

  const _redirect = (
    await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.endpoint, url))
      .orderBy(desc(urlsTable.version))
      .limit(1)
  )[0];
  if (!_redirect) {
    redirect(302, '/', { type: 'error', message: 'URL not found.' }, event);
  }
  const redirect_link = _redirect.redirect_link;
  if (_redirect && !is_plus) {
    await db
      .update(urlsTable)
      .set({ clicked: (_redirect?.clicked ?? 0) + 1 })
      .where(eq(urlsTable.id, _redirect.id));
    redirect(302, redirect_link);
  }
  return { ..._redirect };
};
