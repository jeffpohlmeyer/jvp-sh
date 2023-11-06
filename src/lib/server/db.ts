import { DATABASE, DB_USER, DB_PASSWORD } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const pool = new Pool({
  host: 'localhost',
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
  port: 5432
});

export const db = drizzle(pool);

await migrate(db, { migrationsFolder: 'drizzle' });
