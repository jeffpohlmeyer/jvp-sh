import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

import { db } from '$lib/server/db';
import { create_session, hash, set_cookie } from '$lib/utils/auth';
import { user, token } from '$lib/server/schema';
import { UseZodPayloadType, validate } from '$lib/utils/form';

import { schema, object_refine } from './utils';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    throw redirect(300, '/');
  }

  return { password: '', confirm_password: '' };
};

export const actions: Actions = {
  default: async (event) => {
    const { cookies, request } = event;
    const formData = Object.fromEntries(await request.formData());
    const form_data: { password: string; confirm_password: string; token: string } = {
      password: formData.password?.toString()?.trim(),
      confirm_password: formData.confirm_password?.toString()?.trim(),
      token: formData.token?.toString()?.trim()
    };
    const { valid, errors } = validate<{
      password: string;
      confirm_password: string;
      token: string;
    }>({
      schema_object: schema,
      state_object: formData,
      refine_object: object_refine
    } as UseZodPayloadType);
    if (!valid) {
      return fail(400, { errors, ...form_data });
    }

    const hashed_password = await hash(form_data.password);
    const token_result = await db.select().from(token).where(eq(token.id, form_data.token));
    if (!token_result.length) {
      throw redirect(
        302,
        `/token/new?token-type=reset-password`,
        {
          type: 'error',
          message: 'That token could not be found. Please request a new one.'
        },
        event
      );
    }
    const _token = token_result[0];
    if (_token.token_type !== 'reset-password') {
      throw redirect(
        302,
        `/token/new?token-type=reset-password`,
        {
          type: 'error',
          message: 'That token type is not valid. Please request a new one.'
        },
        event
      );
    }
    if (_token.expires < new Date()) {
      throw redirect(
        302,
        `/token/new?token-type=reset-password`,
        {
          type: 'error',
          message: 'That token has expired. Please request a new one.'
        },
        event
      );
    }
    const user_result = await db
      .update(user)
      .set({ hashed_password })
      .where(eq(user.id, _token.user_id))
      .returning({ user_id: user.id });
    if (!user_result.length) {
      return fail(404, {
        ...form_data,
        error: 'user-not-found',
        message: 'That token does not have a user associated with it.'
      });
    }
    const _user = user_result[0];
    await db
      .delete(token)
      .where(and(eq(token.token_type, 'reset-password'), eq(token.user_id, _user.user_id)));
    const session = await create_session(_user.user_id);
    await set_cookie({ cookies, session });

    throw redirect(
      302,
      '/',
      { type: 'success', message: 'You have successfully reset your password.' },
      event
    );
  }
};
