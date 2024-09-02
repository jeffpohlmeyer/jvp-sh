import { type InferInsertModel, type InferSelectModel, SQL, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';

import { new_id } from '../../utils/id';

// export const user = pgTable('auth_user', {
//   id: varchar('id', {
//     length: 15 // change this when using custom user ids
//   }).primaryKey()
//   // other user attributes
// });
//
// export const session = pgTable('user_session', {
//   id: varchar('id', {
//     length: 128
//   }).primaryKey(),
//   userId: varchar('user_id', {
//     length: 15
//   })
//     .notNull()
//     .references(() => user.id),
//   activeExpires: bigint('active_expires', {
//     mode: 'number'
//   }).notNull(),
//   idleExpires: bigint('idle_expires', {
//     mode: 'number'
//   }).notNull()
// });
//
// export const key = pgTable('user_key', {
//   id: varchar('id', {
//     length: 255
//   }).primaryKey(),
//   userId: varchar('user_id', {
//     length: 15
//   })
//     .notNull()
//     .references(() => user.id),
//   hashedPassword: varchar('hashed_password', {
//     length: 255
//   })
// });

export const userTable = pgTable(
  'user',
  {
    id: varchar('id')
      .$defaultFn(() => new_id('user', 16))
      .primaryKey(),
    email: varchar('email', {
      length: 255
    })
      .notNull()
      .unique(),
    hashed_password: varchar('hashed_password', {
      length: 255
    }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    active: boolean('active').notNull().default(false),
    is_admin: boolean('is_admin').notNull().default(false),
    token: text('token'),
    token_expiration: timestamp('token_expiration'),
    password_reset_required: boolean('password_reset_required').default(false)
  },
  (table) => ({
    // emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
    emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(lower(table.email))
  })
);

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export type UserType = InferSelectModel<typeof userTable>;
export type NewUserType = InferInsertModel<typeof userTable>;

export const sessionTable = pgTable('session', {
  id: varchar('id')
    .$defaultFn(() => new_id('session', 16))
    .primaryKey(),
  userId: varchar('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export type SessionType = InferSelectModel<typeof sessionTable>;

export const urlsTable = pgTable('urls', {
  id: varchar('id')
    .$defaultFn(() => new_id('url', 16))
    .primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  endpoint: varchar('endpoint').notNull(),
  redirect_link: varchar('redirect_link').notNull(),
  version: integer('version').notNull().default(1),
  clicked: integer('clicked').notNull().default(0),
  user_id: varchar('user_id').references(() => userTable.id)
});

export type URLsType = InferSelectModel<typeof urlsTable>;
export type UrlWithEmailType = URLsType & { email?: string };

export const token_type_enum = pgEnum('token_type', ['activation', 'reset-password']);
export const tokenTable = pgTable('tokens', {
  id: varchar('id')
    .$defaultFn(() => new_id('token', 16))
    .primaryKey(),
  token_type: token_type_enum('token_type'),
  expires: timestamp('expires')
    .notNull()
    .default(sql`now() + '60 minutes'`),
  user_id: varchar('user_id')
    .notNull()
    .references(() => userTable.id)
});
