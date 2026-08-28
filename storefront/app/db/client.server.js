import {mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {env, isVercel} from '~/lib/env.server';
import {parsePostgresUrl} from './url';
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
  const configured = env('DATABASE_URL');
  if (configured) {
    const [{drizzle}, {default: postgres}] = await Promise.all([
      import('drizzle-orm/postgres-js'),
      import('postgres'),
    ]);
    const {url, options} = parsePostgresUrl(configured);
    // `max: 1` porque cada invocación serverless es efímera; `prepare: false`
    // es obligatorio detrás de un pooler en modo transacción (PgBouncer).
    const client = postgres(url, {max: 1, prepare: false, ...options});
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
