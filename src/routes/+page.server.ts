import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/server/db';
import { urls } from '$lib/server/schema';
import { generateRandomString } from '$lib/utils';

import { schema } from './utils';

export const load: PageServerLoad = async () => {
  const form = await superValidate(schema);

  return { form };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const redirect_link = form.data.redirect_link.toLowerCase();
    const endpoint = generateRandomString(8);
    await db.insert(urls).values({ redirect_link, endpoint, version: 1 });
    return { form, url: `${url.protocol}//${url.host}/${endpoint}` };
  }
};
