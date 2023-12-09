// export { load } from 'sveltekit-flash-message/server';

import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals }) => {
  return { user_id: locals.user?.id };
});
