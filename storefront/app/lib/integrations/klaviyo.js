/**
 * Klaviyo Integration Client
 *
 * Thin wrapper around Klaviyo's REST API. Used for:
 * - Upserting customer profiles
 * - Tracking custom events (Story Submitted, etc.)
 * - Subscribing to lists
 *
 * All API calls are server-side only. The private key never touches the browser.
 * Gracefully degrades if KLAVIYO_PRIVATE_KEY is not set (e.g., local dev without secrets).
 */

/**
 * @param {string} privateKey - Klaviyo API key (server-side only)
 * @param {string} [communityListId] - Default list ID for community subscriptions
 * @returns {object} Klaviyo client methods
 */
export function createKlaviyoClient(privateKey, communityListId = null) {
  if (!privateKey) {
    console.warn('Klaviyo client: KLAVIYO_PRIVATE_KEY not set. API calls will be no-ops.');
    return {
      upsertProfile: async () => ({ success: false, reason: 'no-key' }),
      trackEvent: async () => ({ success: false, reason: 'no-key' }),
      subscribe: async () => ({ success: false, reason: 'no-key' }),
    };
  }

  const BASE_URL = 'https://a.klaviyo.com/api';
  const headers = {
    'Authorization': `Klaviyo-API-Key ${privateKey}`,
    'Content-Type': 'application/json',
    'revision': '2025-01-15',
  };

  /**
   * Upsert a customer profile (create if new, update if exists by email).
   * @param {object} profile - { email, firstName, lastName, city, properties }
   * @returns {Promise<{success: boolean, profileId?: string, error?: string}>}
   */
  async function upsertProfile(profile) {
    try {
      const response = await fetch(`${BASE_URL}/profiles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email: profile.email,
              first_name: profile.firstName || '',
              last_name: profile.lastName || '',
              location: {
                city: profile.city || '',
              },
              properties: profile.properties || {},
            },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Klaviyo upsertProfile error:', error);
        return { success: false, error: error.errors?.[0]?.detail || 'Unknown error' };
      }

      const data = await response.json();
      return { success: true, profileId: data.data.id };
    } catch (err) {
      console.error('Klaviyo upsertProfile network error:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Track a custom event for a profile.
   * @param {object} event - { metric, profile, properties }
   *   metric: { name: 'Story Submitted' }
   *   profile: { email }
   *   properties: { story, ciudad, prompt, consent, ... }
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function trackEvent(event) {
    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            type: 'event',
            attributes: {
              metric: event.metric,
              profile: event.profile,
              properties: event.properties || {},
              timestamp: new Date().toISOString(),
            },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Klaviyo trackEvent error:', error);
        return { success: false, error: error.errors?.[0]?.detail || 'Unknown error' };
      }

      return { success: true };
    } catch (err) {
      console.error('Klaviyo trackEvent network error:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Subscribe a profile to a list (or add to the community list).
   * @param {object} subscription - { email, firstName, listId }
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function subscribe(subscription) {
    const listId = subscription.listId || communityListId;
    if (!listId) {
      return { success: false, error: 'No list ID provided' };
    }

    try {
      const response = await fetch(`${BASE_URL}/lists/${listId}/relationships/profiles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: subscription.email, // Klaviyo uses email as identifier in relationships
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Klaviyo subscribe error:', error);
        return { success: false, error: error.errors?.[0]?.detail || 'Unknown error' };
      }

      return { success: true };
    } catch (err) {
      console.error('Klaviyo subscribe network error:', err);
      return { success: false, error: err.message };
    }
  }

  return {
    upsertProfile,
    trackEvent,
    subscribe,
  };
}
