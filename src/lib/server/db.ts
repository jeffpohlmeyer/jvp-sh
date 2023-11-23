import {
  DATABASE,
  DB_USER,
  DB_PASSWORD
  // DATABASE_HOST,
  // DATABASE_USERNAME,
  // DATABASE_PASSWORD
} from '$env/static/private';
// import { drizzle } from 'drizzle-orm/planetscale-serverless';
import pkg from 'pg';
const { Pool } = pkg;
// import { connect } from '@planetscale/database';
// import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';

export const pool = new Pool({
  host: 'localhost',
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
  port: 5432
});

export const db = drizzle(pool);

await migrate(db, { migrationsFolder: 'drizzle' });

// const connection = connect({
//   host: DATABASE_HOST,
//   username: DATABASE_USERNAME,
//   password: DATABASE_PASSWORD
// });

// export const db = drizzle(connection);

// await migrate(db, { migrationsFolder: 'drizzle' });
