import type { PageServerLoad } from './$types';

import { cannot_be_logged_in } from '$lib/middleware/auth';

export const load: PageServerLoad = async (event) => {
  cannot_be_logged_in(event);

  return {};
};
