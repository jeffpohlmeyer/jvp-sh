import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

import { DB_DSN } from '$env/static/private';

function getConfig() {
  const configObject = {
    connectionString: DB_DSN
  };
  return configObject;
}

const pool = new pg.Pool(getConfig());
export const db = drizzle(pool);
await migrate(db, { migrationsFolder: 'drizzle' });
