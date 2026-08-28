import {getDb} from '~/db/client.server';
import {env, isVercel} from '~/lib/env.server';
import {chargeDueSubscriptions} from '~/lib/subscriptions.server';

/**
 * Job diario de cobros del Club (Vercel Cron, ver vercel.json en la raíz).
 * Vercel invoca GET con `Authorization: Bearer <CRON_SECRET>`.
 * @param {import('react-router').LoaderFunctionArgs} args
 */
export async function loader({request}) {
  const secret = env('CRON_SECRET');
  if (isVercel && !secret) {
    return Response.json({error: 'CRON_SECRET is not configured'}, {status: 500});
  }
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', {status: 401});
  }

  const db = await getDb();
  const summary = await chargeDueSubscriptions(db, new Date());
  return Response.json({ok: true, ranAt: new Date().toISOString(), ...summary});
}
