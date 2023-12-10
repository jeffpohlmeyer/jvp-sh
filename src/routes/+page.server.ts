import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';
import { validate } from '$lib/utils/form';
import { nanoid } from '$lib/utils/id';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    redirect_link: '',
    link_count: (
      await db
        .select()
        .from(urls)
        .where(eq(urls.user_id, locals?.user?.id))
    ).length
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { locals, request } = event;
    const formData = Object.fromEntries(await request.formData());
    const redirect_link: string = formData.redirect_link?.toString()?.trim();

    const { valid, errors } = validate<{ redirect_link: string }>({
      schema_object: schema,
      state_object: formData
    });
    if (!valid) {
      return fail(400, { errors, redirect_link });
    }
    const endpoint = nanoid(8);
    const payload: { redirect_link: string; endpoint: string; version: number; user_id?: string } =
      { redirect_link, endpoint, version: 1 };
    if (locals.user?.id) {
      payload.user_id = locals.user.id;
    }
    await db.insert(urls).values(payload);
    throw redirect(
      302,
      `/${endpoint}+`,
      { type: 'success', message: 'URL created successfully.' },
      event
    );
  }
};
