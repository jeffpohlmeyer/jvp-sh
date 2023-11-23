import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/server/db';
import { user } from '$lib/server/schema-postgres';

import { schema } from './utils';
import { create_session, set_cookie } from '$lib/utils/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }
  const form = await superValidate(schema);

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const email = form.data.email.trim().toLowerCase();
    const result = await db.select().from(user).where(eq(user.email, email));
    let hashed_password = '',
      active = false,
      _user = null;
    if (result.length > 0) {
      _user = result[0];
      active = _user.active;
      hashed_password = _user.hashed_password;
    }
    const passwords_match = await bcrypt.compare(form.data.password, hashed_password);
    if (!passwords_match) {
      return fail(401, {
        form,
        error: 'invalid-credentials',
        message: 'Invalid email or password'
      });
    }
    if (!active) {
      let url = '/login/inactive';
      if (form.data?.email) {
        url += `?email=${encodeURIComponent(form.data.email)}`;
      }
      throw redirect(300, url);
    }
    if (_user) {
      try {
        const session = await create_session(_user.id);
        await set_cookie({ cookies, session });
      } catch (err) {
        console.log('cookie error', err);
        return fail(401, {
          form,
          error: 'cookie-error',
          message: 'There was an error setting your cookie.'
        });
      }
    }

    return { form, success: 'logged-in' };
  }
};
