import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { must_be_logged_in } from '$lib/middleware/auth';
import { db } from '$lib/server/db';
import { urlsTable } from '$lib/server/schema';
import { url_schema } from '$lib/utils';

export async function check_user_auth_load<E extends ServerLoadEvent | RequestEvent>(event: E) {
  must_be_logged_in(event);

  const id: string = event.params.id ?? '';
  const url = (await db.select().from(urlsTable).where(eq(urlsTable.id, id)).limit(1))[0];
  if (!url) {
    redirect(302, '/account/urls', { type: 'error', message: 'That URL was not found' }, event);
  }
  if (url.user_id !== event.locals.user.id) {
    let message = 'You are not authorized to delete that URL';
    if (event.url.pathname.includes('/edit')) {
      message = 'You are not authorized to edit that URL';
    }
    redirect(302, '/account/urls', { type: 'error', message }, event);
  }
  return {
    url,
    form: await superValidate({ redirect_link: url.redirect_link }, valibot(url_schema))
  };
}

export async function check_user_auth_actions<E extends ServerLoadEvent | RequestEvent>(
  event: E,
  action: 'delete' | 'update'
) {
  must_be_logged_in(event);
  const form = await superValidate(event.request, valibot(url_schema));
  if (!form.valid) {
    return fail(400, { form });
  }

  if (!event.params.id) {
    redirect(302, '/account/urls', { type: 'error', message: 'URL not found' }, event);
  }
  const url = (
    await db.select().from(urlsTable).where(eq(urlsTable.id, event.params.id)).limit(1)
  )[0];
  if (!url) {
    redirect(302, '/account/urls', { type: 'error', message: 'URL not found' }, event);
  }
  if (url.user_id !== event.locals.user.id) {
    let message = 'You are not authorized to delete that URL';
    if (event.url.pathname.includes('/edit')) {
      message = 'You are not authorized to edit that URL';
    }
    redirect(302, '/account/urls', { type: 'error', message }, event);
  }

  if (action === 'delete') {
    await db.delete(urlsTable).where(eq(urlsTable.id, event.params.id));
  } else {
    await db.insert(urlsTable).values({
      endpoint: url.endpoint,
      redirect_link: form.data.redirect_link,
      version: url.version + 1,
      user_id: event.locals.user.id
    });
  }
  redirect(
    302,
    '/account/urls',
    { type: 'success', message: `You have successfully ${action}ed that URL` },
    event
  );
}
