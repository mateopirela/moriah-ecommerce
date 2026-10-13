import {sql} from 'drizzle-orm';
import {getDb} from '~/db/client.server';
import {databaseConfigured, env} from '~/lib/env.server';
import {isSandboxKey, wompiConfig} from '~/lib/wompi.server';

/**
 * Estado de la configuración de producción: solo responde sí/no, nunca valores.
 * Las llaves de Wompi se validan contra su API; el resultado se guarda unos
 * minutos para que nadie use este endpoint para martillar a Wompi.
 */
const TTL_MS = 5 * 60 * 1000;
let cached = null;

async function wompiStatus() {
  const config = wompiConfig();
  const mode = isSandboxKey(config.publicKey) ? 'test' : 'prod';

  const publicKey = await fetch(`${config.baseUrl}/merchants/${config.publicKey}`)
    .then((r) => r.ok)
    .catch(() => false);
  // Buscar transacciones exige la llave privada: 401 si no es válida.
  const privateKey = config.privateKey
    ? await fetch(`${config.baseUrl}/transactions?reference=health-check`, {
        headers: {Authorization: `Bearer ${config.privateKey}`},
      })
        .then((r) => r.ok)
        .catch(() => false)
    : false;

  return {
    mode,
    publicKey,
    privateKey: privateKey && config.privateKey.startsWith(`prv_${mode}_`),
    integritySecret: config.integritySecret.startsWith(`${mode}_integrity_`),
    eventsSecret: config.eventsSecret.startsWith(`${mode}_events_`),
  };
}

async function databaseStatus() {
  if (!databaseConfigured()) return false;
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

export async function loader() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const [database, wompi] = await Promise.all([databaseStatus(), wompiStatus()]);
    cached = {
      at: Date.now(),
      body: {database, wompi, cronSecret: Boolean(env('CRON_SECRET'))},
    };
  }
  const {body} = cached;
  const ok =
    body.database &&
    body.cronSecret &&
    Object.entries(body.wompi).every(([k, v]) => k === 'mode' || v);
  return Response.json(
    {ok, checkedAt: new Date(cached.at).toISOString(), ...body},
    {status: ok ? 200 : 503, headers: {'Cache-Control': 'no-store'}},
  );
}
