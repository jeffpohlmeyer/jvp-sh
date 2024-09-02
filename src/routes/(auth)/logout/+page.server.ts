import { redirect } from 'sveltekit-flash-message/server';

import type { Actions, PageServerLoad } from './$types';

import { must_be_logged_in } from '$lib/middleware/auth';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
  must_be_logged_in(event);

  return {};
};

export const actions: Actions = {
  default: async (event) => {
    must_be_logged_in(event);
    await lucia.invalidateSession(event.locals.session?.id as string);
    const blankCookie = lucia.createBlankSessionCookie();
    event.cookies.set(blankCookie.name, blankCookie.value, {
      path: '.',
      ...blankCookie.attributes
    });
    return redirect(
      302,
      '/',
      {
        title: 'Logout Success',
        message: 'You have successfully logged out',
        type: 'success'
      },
      event
    );
  }
};
