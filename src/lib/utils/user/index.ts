import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { lower, type NewUserType, userTable } from '$lib/server/schema';
import { new_id } from '$lib/utils/id';

type OptsType = {
  [key in keyof NewUserType]: never;
};

export async function create_user_token(email: string, opts?: OptsType) {
  const token = new_id('token');
  await db
    .update(userTable)
    .set({ token, token_expiration: new Date(Date.now() + 60 * 60 * 1000), ...(opts ?? {}) })
    .where(eq(lower(userTable.email), email));
  return token;
}
