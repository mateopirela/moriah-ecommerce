import {createHash} from 'node:crypto';
import {describe, expect, it} from 'vitest';
import {
  buildCheckoutUrl,
  eventChecksum,
  integritySignature,
  isSandboxKey,
  mapStatus,
  newReference,
  verifyEvent,
} from './wompi.server';

// Ejemplos tomados de la documentación oficial de Wompi.
const INTEGRITY_SECRET = 'prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6';
const EVENTS_SECRET = 'prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z';

describe('integritySignature', () => {
  it('matches the documented example', () => {
    const signature = integritySignature(
      {reference: 'sk8-438k4-xmxm392-sn2m', amountInCents: 2490000, currency: 'COP'},
      INTEGRITY_SECRET,
    );
    expect(signature).toBe('37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5');
  });

  it('includes the expiration time when provided', () => {
    const withExp = integritySignature(
      {reference: 'A', amountInCents: 100, currency: 'COP', expiresAt: '2030-01-01T00:00:00.000Z'},
      'secret',
    );
    const without = integritySignature({reference: 'A', amountInCents: 100, currency: 'COP'}, 'secret');
    expect(withExp).not.toBe(without);
  });
});

describe('buildCheckoutUrl', () => {
  it('builds a signed Web Checkout URL with customer and shipping data', () => {
    const url = new URL(
      buildCheckoutUrl(
        {
          reference: 'MOR-1',
          amountInCents: 4500000,
          redirectUrl: 'https://tienda.test/checkout/gracias?ref=MOR-1',
          customer: {email: 'ana@test.co', fullName: 'Ana Pérez', phone: '3001234567'},
          shipping: {addressLine1: 'Calle 1 # 2-3', city: 'Bogotá', region: 'Bogotá D.C.'},
        },
        {publicKey: 'pub_test_abc', integritySecret: 'secret'},
      ),
    );
    expect(url.origin + url.pathname).toBe('https://checkout.wompi.co/p/');
    expect(url.searchParams.get('public-key')).toBe('pub_test_abc');
    expect(url.searchParams.get('amount-in-cents')).toBe('4500000');
    expect(url.searchParams.get('currency')).toBe('COP');
    expect(url.searchParams.get('signature:integrity')).toBe(
      integritySignature({reference: 'MOR-1', amountInCents: 4500000, currency: 'COP'}, 'secret'),
    );
    expect(url.searchParams.get('redirect-url')).toBe('https://tienda.test/checkout/gracias?ref=MOR-1');
    expect(url.searchParams.get('customer-data:email')).toBe('ana@test.co');
    expect(url.searchParams.get('shipping-address:city')).toBe('Bogotá');
    expect(url.searchParams.get('shipping-address:country')).toBe('CO');
  });
});

describe('event checksum', () => {
  const event = {
    event: 'transaction.updated',
    data: {
      transaction: {
        id: '1234-1610641025-49201',
        amount_in_cents: 4490000,
        reference: 'MZQ3X2DE2SMX',
        status: 'APPROVED',
      },
    },
    environment: 'prod',
    signature: {
      properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      checksum: '3476DDA50F64CD7CBD160689640506FEBEA93239BC524FC0469B2C68A3CC8BD0',
    },
    timestamp: 1530291411,
  };

  it('concatenates property values, timestamp and secret exactly as documented', () => {
    // La documentación muestra esta cadena concatenada para el ejemplo; el
    // checksum impreso allí no corresponde a esos valores, así que verificamos
    // contra el SHA256 real de la concatenación documentada.
    const documentedConcatenation =
      '1234-1610641025-49201APPROVED44900001530291411prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z';
    const expected = createHash('sha256').update(documentedConcatenation).digest('hex').toUpperCase();
    expect(eventChecksum(event, EVENTS_SECRET)).toBe(expected);
    expect(verifyEvent({...event, signature: {...event.signature, checksum: expected}}, EVENTS_SECRET)).toBe(true);
    expect(verifyEvent({...event, signature: {...event.signature, checksum: expected.toLowerCase()}}, EVENTS_SECRET)).toBe(true);
  });

  it('rejects tampered payloads', () => {
    const tampered = {...event, data: {transaction: {...event.data.transaction, status: 'DECLINED'}}};
    expect(verifyEvent(tampered, EVENTS_SECRET)).toBe(false);
    expect(verifyEvent(event, 'other-secret')).toBe(false);
    expect(verifyEvent({...event, signature: {}}, EVENTS_SECRET)).toBe(false);
  });
});

describe('helpers', () => {
  it('detects the sandbox from the public key prefix', () => {
    expect(isSandboxKey('pub_test_x')).toBe(true);
    expect(isSandboxKey('pub_prod_x')).toBe(false);
  });

  it('maps Wompi statuses to internal statuses', () => {
    expect(mapStatus('APPROVED')).toBe('approved');
    expect(mapStatus('DECLINED')).toBe('declined');
    expect(mapStatus('VOIDED')).toBe('voided');
    expect(mapStatus('ERROR')).toBe('error');
    expect(mapStatus('PENDING')).toBe('pending');
    expect(mapStatus(undefined)).toBe('pending');
  });

  it('generates unique, prefixed references', () => {
    const a = newReference('MOR');
    const b = newReference('MOR');
    expect(a).toMatch(/^MOR-[0-9A-Z]+-[0-9A-F]{6}$/);
    expect(a).not.toBe(b);
  });
});
