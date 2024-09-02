import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ['./.env.local'] });

export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
  schema: './src/lib/server/schema/postgres.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DB_DSN!
  }
});
