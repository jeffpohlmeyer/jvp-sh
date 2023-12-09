import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import bcrypt from 'bcryptjs';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import { hash, get_user_from_cookie } from '$lib/utils/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { validate } from '$lib/utils/form';
import { schema, object_refine } from './utils';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  if (!locals?.user?.id) {
    throw redirect(
      302,
      `/login?redirect=${url.pathname}`,
      { type: 'warning', message: 'You need to be logged in to access that page.' },
      event
    );
  }

  return { current_password: '', password: '', confirm_password: '' };
};

export const actions: Actions = {
  default: async (event) => {
    const { cookies, request } = event;
    const formData = Object.fromEntries(await request.formData());
    const { valid, errors } = validate<{
      current_password: string;
      password: string;
      confirm_password: string;
    }>({
      schema_object: schema,
      state_object: formData,
      object_refine
    });
    if (!valid) {
      return fail(400, { errors, ...formData });
    }

    try {
      const _user = await get_user_from_cookie({ cookies });
      const passwords_match = await bcrypt.compare(
        formData.current_password.toString(),
        _user.hashed_password
      );
      if (!passwords_match) {
        errors.current_password = ['Your current password is incorrect.'];
        return fail(400, {
          ...formData,
          errors,
          error: 'incorrect-password'
        });
      }
      const hashed_password = await hash(formData.password.toString());
      await db.update(user).set({ hashed_password }).where(eq(user.id, _user.id));
      setFlash({ type: 'success', message: 'Your password has been changed.' }, event);
      return { current_password: '', password: '', confirm_password: '', success: true };
    } catch (err) {
      console.log('err', err);
      return fail(500, {
        ...formData,
        error: 'token-not-created',
        message: 'An error occurred while creating a token. Please try again.'
      });
    }

    throw redirect(302, '/forgot-password/confirm');
  }
};
