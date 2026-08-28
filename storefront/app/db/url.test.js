import {describe, expect, it} from 'vitest';
import {parsePostgresUrl} from './url';

describe('parsePostgresUrl', () => {
  it('traduce sslmode y quita los parámetros de cliente (formato Neon)', () => {
    const {url, options} = parsePostgresUrl(
      'postgres://user:pw@ep-abc-123-pooler.us-east-2.aws.neon.tech/moriah?sslmode=require&channel_binding=require',
    );
    expect(options.ssl).toBe('require');
    expect(url).not.toContain('sslmode');
    expect(url).not.toContain('channel_binding');
    expect(url).toContain('ep-abc-123-pooler.us-east-2.aws.neon.tech');
    expect(url).toContain('/moriah');
  });

  it('conserva los parámetros que sí entiende el servidor', () => {
    const {url} = parsePostgresUrl(
      'postgres://u:p@host:5432/db?sslmode=require&application_name=moriah',
    );
    expect(url).toContain('application_name=moriah');
  });

  it('mapea cada sslmode a la opción de postgres.js', () => {
    const ssl = (mode) => parsePostgresUrl(`postgres://u:p@h/db?sslmode=${mode}`).options.ssl;
    expect(ssl('disable')).toBe(false);
    expect(ssl('prefer')).toBe('prefer');
    expect(ssl('require')).toBe('require');
    expect(ssl('verify-full')).toBe(true);
  });

  it('sin sslmode no impone opciones y deja la URL intacta', () => {
    const {url, options} = parsePostgresUrl('postgres://u:p@localhost:5432/moriah');
    expect(options).toEqual({});
    expect(url).toBe('postgres://u:p@localhost:5432/moriah');
  });

  it('lee connect_timeout y no lo reenvía al servidor', () => {
    const {url, options} = parsePostgresUrl('postgres://u:p@h/db?connect_timeout=10');
    expect(options.connect_timeout).toBe(10);
    expect(url).not.toContain('connect_timeout');
  });

  it('devuelve la cadena tal cual si no es una URL válida', () => {
    expect(parsePostgresUrl('no-es-una-url').url).toBe('no-es-una-url');
  });
});
