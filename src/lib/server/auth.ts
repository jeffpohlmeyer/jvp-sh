import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';

import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { sessionTable, userTable } from '$lib/server/schema/postgres';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    hashed_password: attributes.hashed_password,
    created_at: attributes.created_at,
    active: attributes.active,
    is_admin: attributes.is_admin,
    token: attributes.token,
    token_expiration: attributes.token_expiration,
    password_reset_required: attributes.password_reset_required
  })
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = {
  email: string;
  hashed_password?: string;
  created_at: Date;
  active: boolean;
  is_admin: boolean;
  token?: string;
  token_expiration?: Date;
  password_reset_required?: boolean;
};
