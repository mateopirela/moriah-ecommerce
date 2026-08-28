import {mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {env, isVercel} from '~/lib/env.server';
import * as schema from './schema';

const here = dirname(fileURLToPath(import.meta.url));
// Works both from source (app/db) and from the server bundle (build/server).
const migrationsFolder = resolve(here, '..', '..', 'drizzle');

let dbPromise;

/**
 * Lazily creates the Drizzle client.
 *  - `DATABASE_URL` set → Postgres via postgres.js (any provider).
 *  - unset locally     → embedded PGlite in ./.data (auto-migrated). Handy for
 *                        development and tests; never used in production.
 * @returns {Promise<import('drizzle-orm/pg-core').PgDatabase<any, typeof schema>>}
 */
export function getDb() {
  if (!dbPromise) dbPromise = createDb();
  return dbPromise;
}

async function createDb() {
  const url = env('DATABASE_URL');
  if (url) {
    const [{drizzle}, {default: postgres}] = await Promise.all([
      import('drizzle-orm/postgres-js'),
      import('postgres'),
    ]);
    const client = postgres(url, {max: 1, prepare: false});
    return drizzle({client, schema});
  }

  if (isVercel) {
    throw new Error(
      'DATABASE_URL is not set. Configure a Postgres connection string in the project environment variables.',
    );
  }

  const [{drizzle}, {migrate}, {PGlite}] = await Promise.all([
    import('drizzle-orm/pglite'),
    import('drizzle-orm/pglite/migrator'),
    import('@electric-sql/pglite'),
  ]);
  const dataDir = env('PGLITE_DATA_DIR', resolve(process.cwd(), '.data/pglite'));
  if (dataDir !== 'memory') mkdirSync(dataDir, {recursive: true});
  const client = new PGlite(dataDir === 'memory' ? undefined : dataDir);
  const db = drizzle({client, schema});
  await migrate(db, {migrationsFolder});
  return db;
}

/**
 * Test helper: swap in a preconfigured database (e.g. in-memory PGlite).
 * @param {any} db
 */
export function __setDbForTests(db) {
  dbPromise = Promise.resolve(db);
}

export {schema};
