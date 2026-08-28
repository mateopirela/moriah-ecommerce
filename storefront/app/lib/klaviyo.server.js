/**
 * Klaviyo — perfiles, eventos y listas (solo servidor).
 * Si KLAVIYO_PRIVATE_KEY no está configurada, todas las llamadas son no-ops:
 * el sitio funciona igual, solo sin emails automáticos.
 */
import {env} from '~/lib/env.server';
import {formatCop} from '~/lib/catalog';

const BASE_URL = 'https://a.klaviyo.com/api';
const REVISION = '2025-01-15';

let client;

export function getKlaviyo() {
  if (!client) {
    client = createKlaviyoClient(
      env('KLAVIYO_PRIVATE_KEY'),
      env('KLAVIYO_COMMUNITY_LIST_ID') || null,
    );
  }
  return client;
}

/**
 * @param {string} privateKey
 * @param {string|null} [communityListId]
 */
export function createKlaviyoClient(privateKey, communityListId = null) {
  if (!privateKey) {
    const noop = async () => ({success: false, reason: 'no-key'});
    return {enabled: false, upsertProfile: noop, trackEvent: noop, subscribe: noop};
  }

  const headers = {
    Authorization: `Klaviyo-API-Key ${privateKey}`,
    'Content-Type': 'application/json',
    revision: REVISION,
  };

  async function call(path, body) {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`Klaviyo ${path} error:`, error);
        return {success: false, error: error.errors?.[0]?.detail || 'Unknown error'};
      }
      const data = response.status === 204 ? null : await response.json().catch(() => null);
      return {success: true, data};
    } catch (err) {
      console.error(`Klaviyo ${path} network error:`, err);
      return {success: false, error: err.message};
    }
  }

  return {
    enabled: true,
    /** @param {{email: string, firstName?: string, lastName?: string, city?: string, properties?: object}} profile */
    upsertProfile(profile) {
      return call('/profiles', {
        data: {
          type: 'profile',
          attributes: {
            email: profile.email,
            first_name: profile.firstName || '',
            last_name: profile.lastName || '',
            location: {city: profile.city || ''},
            properties: profile.properties || {},
          },
        },
      });
    },
    /** @param {{metric: {name: string}, profile: {email: string}, properties?: object, value?: number}} event */
    trackEvent(event) {
      return call('/events', {
        data: {
          type: 'event',
          attributes: {
            metric: {data: {type: 'metric', attributes: event.metric}},
            profile: {data: {type: 'profile', attributes: event.profile}},
            properties: event.properties || {},
            value: event.value,
            time: new Date().toISOString(),
          },
        },
      });
    },
    /** @param {{email: string, listId?: string}} subscription */
    subscribe(subscription) {
      const listId = subscription.listId || communityListId;
      if (!listId) return Promise.resolve({success: false, error: 'No list ID provided'});
      return call(`/lists/${listId}/relationships/profiles`, {
        data: [{type: 'profile', id: subscription.email}],
      });
    },
  };
}

/* ------------------------------------------------------------------ */
/* Notificaciones transaccionales (flows en Klaviyo por nombre de métrica) */
/* ------------------------------------------------------------------ */

/**
 * @param {{reference: string, amountCents: number, items: any[], shipping: any}} order
 * @param {{email: string, name: string}} customer
 */
export function notifyOrderPaid(order, customer) {
  return getKlaviyo().trackEvent({
    metric: {name: 'Placed Order'},
    profile: {email: customer.email, first_name: customer.name},
    value: order.amountCents / 100,
    properties: {
      reference: order.reference,
      total: formatCop(order.amountCents / 100),
      items: order.items,
      shipping: order.shipping,
      subscription: Boolean(order.subscriptionId),
    },
  });
}

/**
 * @param {{id: string, cafeTitle: string, frequencyLabel: string, amountCents: number}} sub
 * @param {{email: string, name: string}} customer
 * @param {string} manageUrl
 */
export function notifySubscriptionStarted(sub, customer, manageUrl) {
  return getKlaviyo().trackEvent({
    metric: {name: 'Subscription Started'},
    profile: {email: customer.email, first_name: customer.name},
    value: sub.amountCents / 100,
    properties: {
      subscriptionId: sub.id,
      cafe: sub.cafeTitle,
      frequency: sub.frequencyLabel,
      amount: formatCop(sub.amountCents / 100),
      manageUrl,
    },
  });
}

/**
 * @param {{id: string, status: string}} sub
 * @param {{email: string, name: string}} customer
 * @param {string} manageUrl
 */
export function notifySubscriptionPaymentFailed(sub, customer, manageUrl) {
  return getKlaviyo().trackEvent({
    metric: {name: 'Subscription Payment Failed'},
    profile: {email: customer.email, first_name: customer.name},
    properties: {subscriptionId: sub.id, status: sub.status, manageUrl},
  });
}

/**
 * @param {{id: string, status: string}} sub
 * @param {{email: string, name: string}} customer
 */
export function notifySubscriptionStatus(sub, customer) {
  return getKlaviyo().trackEvent({
    metric: {name: 'Subscription Updated'},
    profile: {email: customer.email, first_name: customer.name},
    properties: {subscriptionId: sub.id, status: sub.status},
  });
}
