import { check_user_auth_actions, check_user_auth_load } from '../utils';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  return { url: await check_user_auth_load(event) };
};

export const actions: Actions = {
  default: async (event) => {
    return check_user_auth_actions(event, 'delete');
  }
};
