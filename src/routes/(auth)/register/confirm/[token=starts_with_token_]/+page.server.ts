import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

import { cannot_be_logged_in } from '$lib/middleware/auth';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema/postgres';
import { create_user_session } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
  cannot_be_logged_in(event);
  const { token } = event.params;
  const user = (
    await db
      .select({ id: userTable.id, token_expiration: userTable.token_expiration })
      .from(userTable)
      .where(eq(userTable.token, token))
      .limit(1)
  )[0];
  if (!user) {
    return redirect(
      302,
      '/token/new?token-type=confirm',
      {
        title: 'Invalid token',
        message: 'The token provided did not match with a user in our system',
        type: 'error',
        timeout: 15000
      },
      event
    );
  }
  console.log('user.token_expiration', user.token_expiration);
  console.log('new Date(Date.now())', new Date(Date.now()));
  console.log('user', user);
  if (!user.token_expiration || user.token_expiration < new Date(Date.now())) {
    return redirect(
      302,
      '/token/new?token-type=confirm',
      {
        title: 'Expired',
        message: 'That token has expired, please get a new one.',
        type: 'error',
        timeout: 15000
      },
      event
    );
  }
  await db
    .update(userTable)
    .set({ token: '', token_expiration: null, active: true })
    .where(eq(userTable.id, user.id));
  await create_user_session({ user_id: user.id, event });

  let _redirect = '/';
  if (event.url.searchParams.has('redirect')) {
    _redirect = event.url.searchParams.get('redirect')!;
  }

  redirect(
    302,
    _redirect,
    {
      title: 'Login Success',
      message: 'You have successfully confirmed your email address',
      type: 'success'
    },
    event
  );
};
