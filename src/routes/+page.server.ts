import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { urlsTable } from '$lib/server/schema';
import { url_schema } from '$lib/utils';
import { nanoid } from '$lib/utils/id';

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(valibot(url_schema));
  let link_count = 0;
  if (locals.user) {
    link_count = (
      await db
        .select()
        .from(urlsTable)
        .where(eq(urlsTable.user_id, locals?.user?.id))
    ).length;
  }
  return {
    redirect_link: '',
    link_count,
    form
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event.request, valibot(url_schema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const redirect_link: string = form.data.redirect_link?.toString()?.trim();

    const endpoint = nanoid(8);
    const payload: { redirect_link: string; endpoint: string; version: number; user_id?: string } =
      { redirect_link, endpoint, version: 1 };
    if (event.locals.user?.id) {
      payload.user_id = event.locals.user.id;
    }
    await db.insert(urlsTable).values(payload);
    throw redirect(
      302,
      `/${endpoint}+`,
      { type: 'success', message: 'URL created successfully.' },
      event
    );
  }
};
