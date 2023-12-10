import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { create_session, set_cookie } from '$lib/utils/auth';
import { validate } from '$lib/utils/form';

import { schema } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(302, '/');
  }

  return { email: '', password: '' };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, cookies, url } = event;
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email?.toString()?.trim().toLowerCase();
    const { valid, errors } = validate<{ email: string; password: string }>({
      schema_object: schema,
      state_object: formData
    });
    if (!valid) {
      return fail(400, { errors, email });
    }
    const result = await db.select().from(user).where(eq(user.email, email));
    let hashed_password = '',
      active = false,
      _user = null;
    if (!result.length) {
      setFlash(
        { type: 'error', title: 'Error', message: 'Invalid email or password.', clearable: false },
        event
      );
      return fail(401, {
        email,
        error: 'invalid-credentials'
      });
    } else {
      _user = result[0];
      active = _user.active;
      hashed_password = _user.hashed_password as string;
    }
    const passwords_match = await bcrypt.compare(formData.password.toString(), hashed_password);
    if (!passwords_match) {
      setFlash(
        { type: 'error', title: 'Error', message: 'Invalid email or password.', clearable: false },
        event
      );
      return fail(401, {
        email,
        error: 'invalid-credentials'
      });
    }
    if (!active) {
      let url = '/login/inactive';
      if (formData?.email) {
        url += `?email=${encodeURIComponent(formData.email.toString())}`;
      }
      throw redirect(302, url);
    }
    if (_user) {
      try {
        const session = await create_session(_user.id);
        await set_cookie({ cookies, session });
      } catch (err) {
        console.log('cookie error', err);
        setFlash(
          {
            type: 'error',
            title: 'Server Error',
            message: 'There was an error setting your cookie.',
            clearable: false
          },
          event
        );
        return fail(401, {
          email,
          error: 'cookie-error'
        });
      }
    }
    let _redirect = '/';
    if (url.searchParams.has('redirect')) {
      _redirect = url.searchParams.get('redirect')!;
    }
    throw redirect(302, _redirect, { type: 'success', message: 'You have been logged in.' }, event);
  }
};
