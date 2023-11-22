import {
  mysqlTable,
  boolean,
  bigint,
  serial,
  int,
  varchar,
  timestamp
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const user = mysqlTable('user', {
  id: varchar('id', {
    length: 15 // change this when using custom user ids
  }).primaryKey(),
  email: varchar('email', {
    length: 255
  }).notNull(),
  hashed_password: varchar('hashed_password', {
    length: 255
  }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(false)
});

export const session = mysqlTable('session', {
  id: varchar('id', {
    length: 128
  }).primaryKey(),
  user_id: varchar('user_id', {
    length: 15
  }).notNull(),
  expires: bigint('expires', {
    mode: 'number'
  }).notNull()
});

export const urls = mysqlTable('urls', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  endpoint: varchar('endpoint', { length: 8 }).notNull(),
  redirect_link: varchar('redirect_link', { length: 1024 }).notNull(),
  version: int('version').notNull().default(1),
  clicked: int('clicked').notNull().default(0)
});

export const user_session_relations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.user_id],
    references: [user.id]
  })
}));
