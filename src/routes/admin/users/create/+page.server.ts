import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { must_be_logged_in } from '$lib/middleware/auth';
import { check_admin_user } from '$lib/middleware/admin';
import { type UseZodPayloadType, validate } from '$lib/utils/form';

import { schema } from './utils';

export const load: PageServerLoad = async (event) => {
  must_be_logged_in(event);
  check_admin_user(event);
  return {
    email: '',
    active: false,
    is_admin: false
  };
};

export const actions: Actions = {
  default: async (event) => {
    must_be_logged_in(event);
    check_admin_user(event);
    const { request } = event;
    const formData = Object.fromEntries(await request.formData());
    const email = formData.email?.toString()?.trim().toLowerCase();
    const is_admin = !!formData.is_admin ?? false;
    const active = !!formData.active ?? false;
    const { valid, errors } = validate<{
      email: string;
      active: boolean;
      is_admin: boolean;
    }>({
      schema_object: schema,
      state_object: formData
    } as UseZodPayloadType);
    if (!valid) {
      return fail(400, { errors, email, is_admin, active });
    }

    const result = await db.select().from(user).where(eq(user.email, email));
    if (result.length > 0) {
      setFlash({ type: 'error', message: 'An account with that email already exists' }, event);
      return fail(400, {
        email,
        is_admin,
        active,
        error: 'duplicate-account'
      });
    }

    try {
      const payload: { email: string; is_admin: boolean; active: boolean } = {
        email,
        is_admin,
        active
      };
      await db.insert(user).values(payload);
    } catch (err) {
      console.log('err', err);
      if (err.code === '23505') {
        setFlash({ type: 'error', message: 'An account with that email already exists' }, event);
        return fail(400, {
          email,
          is_admin,
          active,
          error: 'duplicate-account'
        });
      } else {
        setFlash({ type: 'error', message: 'An unknown error occurred.' }, event);
        return fail(500, { email, is_admin, active, error: 'unknown' });
      }
    }
    throw redirect(
      302,
      '/admin/users',
      { type: 'success', message: `User ${email} successfully created` },
      event
    );
  }
};
