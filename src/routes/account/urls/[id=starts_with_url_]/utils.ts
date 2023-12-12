import { fail, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';

import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';

export async function check_user_auth_load<E extends ServerLoadEvent | RequestEvent>(event: E) {
  const { locals, params, url } = event;
  if (!locals?.user?.id) {
    throw redirect(
      302,
      `/login?redirect=${url.pathname}`,
      { type: 'warning', message: 'You need to be logged in to access that page.' },
      event
    );
  }
  const id: string = params.id ?? '';
  const url_result = await db.select().from(urls).where(eq(urls.id, id));
  if (!url_result.length) {
    throw redirect(
      302,
      '/account/urls',
      { type: 'error', message: 'That URL was not found' },
      event
    );
  }
  const _url = url_result[0];
  if (_url.user_id !== locals.user.id) {
    throw redirect(
      302,
      '/account/urls',
      { type: 'error', message: 'You are not authorized to delete this URL' },
      event
    );
  }
  return _url;
}

export async function check_user_auth_actions<E extends ServerLoadEvent | RequestEvent>(
  event: E,
  action: 'delete' | 'update'
) {
  const { locals } = event;
  type FormDataType = {
    id: number;
    endpoint: string;
    redirect_link: string;
    version: number;
    user_id: string;
  };
  const formData = Object.fromEntries(await event.request.formData());
  const form_data: FormDataType = {
    id: +formData.id ?? event.params.id,
    endpoint: formData.endpoint.toString() ?? '',
    redirect_link: formData.redirect_link.toString() ?? '',
    version: +formData.version ?? 0,
    user_id: locals.user.id
  };
  const id = form_data.id ?? event.params.id;

  if (!locals?.user?.id) {
    setFlash({ type: 'error', message: 'You need to be logged in.' }, event);
    return fail(401, { ...form_data });
  }
  if (!id) {
    setFlash({ type: 'error', message: 'URL not found.' }, event);
    return fail(404, { ...form_data });
  }
  const url_result = await db.select().from(urls).where(eq(urls.id, id));
  if (!url_result.length) {
    setFlash({ type: 'error', message: 'URL not found.' }, event);
    return fail(404, { ...form_data });
  }
  const url = url_result[0];
  if (url.user_id !== locals.user.id) {
    setFlash({ type: 'error', message: 'You are not authorized to delete this URL.' }, event);
    return fail(403, { ...form_data });
  }
  if (action === 'delete') {
    await db.delete(urls).where(eq(urls.id, id));
  } else {
    await db.insert(urls).values({
      endpoint: url.endpoint,
      redirect_link: form_data.redirect_link,
      version: url.version + 1,
      user_id: locals.user.id
    });
  }
  throw redirect(
    302,
    '/account/urls',
    { type: 'success', message: `You have successfully ${action}ed that URL` },
    event
  );
}
