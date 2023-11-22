import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals?.user?.id) {
    console.log('userId', locals.user.id);
    throw redirect(302, '/');
  }
  return {};
};
