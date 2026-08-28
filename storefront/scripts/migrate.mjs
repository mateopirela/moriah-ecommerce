/**
 * Applies the SQL migrations in ./drizzle to the Postgres in DATABASE_URL.
 * Runs as part of the Vercel build (see root vercel.json) and can be run by
 * hand: `npm run db:migrate`. No-op when DATABASE_URL is not set.
 */
import 'dotenv/config';
import {drizzle} from 'drizzle-orm/postgres-js';
import {migrate} from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('[migrate] DATABASE_URL not set — skipping migrations.');
  process.exit(0);
}

const client = postgres(url, {max: 1, prepare: false});
try {
  await migrate(drizzle({client}), {migrationsFolder: './drizzle'});
  console.warn('[migrate] migrations applied.');
} finally {
  await client.end();
}
