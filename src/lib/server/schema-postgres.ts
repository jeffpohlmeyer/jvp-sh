import { sql } from 'drizzle-orm';
import {
  pgTable,
  boolean,
  bigint,
  integer,
  varchar,
  serial,
  timestamp,
  uuid,
  pgEnum
} from 'drizzle-orm/pg-core';

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

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', {
    length: 255
  })
    .notNull()
    .unique(),
  hashed_password: varchar('hashed_password', {
    length: 255
  }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(false)
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id),
  expires: timestamp('expires').default(sql`now() + '30 days'`)
});

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  endpoint: varchar('endpoint').notNull(),
  redirect_link: varchar('redirect_link').notNull(),
  version: integer('version').notNull().default(1),
  clicked: integer('clicked').notNull().default(0)
});

export const token_type_enum = pgEnum('token_type', ['activation', 'reset-password']);
export const token = pgTable('tokens', {
  id: uuid('uuid').defaultRandom().primaryKey(),
  token_type: token_type_enum('token_type'),
  expires: timestamp('expires')
    .notNull()
    .default(sql`now() + '60 minutes'`),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id)
});
