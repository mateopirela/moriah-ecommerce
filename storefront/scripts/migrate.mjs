/**
 * Applies the SQL migrations in ./drizzle to the Postgres in DATABASE_URL.
 * Runs as part of the production build (see vercel.json) and can be run by
 * hand: `npm run db:migrate`. No-op when DATABASE_URL is not set.
 */
import 'dotenv/config';
import {drizzle} from 'drizzle-orm/postgres-js';
import {migrate} from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import {parsePostgresUrl} from '../app/db/url.js';

const configured = process.env.DATABASE_URL;
if (!configured) {
  console.warn('[migrate] DATABASE_URL not set — skipping migrations.');
  process.exit(0);
}

const {url, options} = parsePostgresUrl(configured);
const client = postgres(url, {max: 1, prepare: false, ...options});
try {
  await migrate(drizzle({client}), {migrationsFolder: './drizzle'});
  console.warn('[migrate] migrations applied.');
} finally {
  await client.end();
}
