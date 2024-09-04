import { redirect } from 'sveltekit-flash-message/server';

import type { PageServerLoad } from './$types';

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

  return {};
};
