/**
 * Eventos de analítica en el navegador (GA4 + Meta Pixel).
 * No-op cuando los pixels no están cargados (sin IDs en el entorno).
 */

function gtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

function fbq(...args) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

const item = (p, quantity = 1) => ({
  item_id: p.handle,
  item_name: p.title,
  price: p.unitPrice ?? p.price ?? 0,
  quantity,
});

export const analytics = {
  pageView() {
    gtag('event', 'page_view');
    fbq('track', 'PageView');
  },
  /** @param {{handle: string, title: string, price: number}} product */
  viewItem(product) {
    gtag('event', 'view_item', {
      currency: 'COP',
      value: product.price,
      items: [item(product)],
    });
    fbq('track', 'ViewContent', {
      content_name: product.title,
      content_ids: [product.handle],
      content_type: 'product',
      value: product.price,
      currency: 'COP',
    });
  },
  /** @param {{handle: string, title: string, unitPrice?: number, price?: number}} product @param {number} quantity */
  addToCart(product, quantity = 1) {
    const value = (product.unitPrice ?? product.price ?? 0) * quantity;
    gtag('event', 'add_to_cart', {
      currency: 'COP',
      value,
      items: [item(product, quantity)],
    });
    fbq('track', 'AddToCart', {
      content_ids: [product.handle],
      content_type: 'product',
      value,
      currency: 'COP',
    });
  },
  /** @param {{total: number, lines: any[]}} cart */
  beginCheckout(cart) {
    gtag('event', 'begin_checkout', {
      currency: 'COP',
      value: cart.total,
      items: cart.lines.map((l) => item(l, l.quantity)),
    });
    fbq('track', 'InitiateCheckout', {value: cart.total, currency: 'COP'});
  },
  /** @param {{reference: string, amountCents: number, items: any[]}} order */
  purchase(order) {
    const value = order.amountCents / 100;
    gtag('event', 'purchase', {
      transaction_id: order.reference,
      currency: 'COP',
      value,
      items: (order.items ?? []).map((l) => item(l, l.quantity)),
    });
    fbq('track', 'Purchase', {value, currency: 'COP'});
  },
  /** @param {string} term */
  search(term) {
    gtag('event', 'search', {search_term: term});
    fbq('track', 'Search', {search_string: term});
  },
};
