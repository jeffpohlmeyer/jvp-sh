import type { Actions, PageServerLoad } from './$types';

import { check_user_auth_load, check_user_auth_actions } from '../utils';

export const load: PageServerLoad = async (event) => {
  return { ...(await check_user_auth_load(event)) };
};

export const actions: Actions = {
  default: async (event) => {
    return check_user_auth_actions(event, 'update');
  }
};
