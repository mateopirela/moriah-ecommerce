/**
 * Normaliza una cadena de conexión de Postgres para postgres.js.
 *
 * Los proveedores serverless entregan URLs con parámetros de libpq
 * (`sslmode`, `channel_binding`, `connect_timeout`…). postgres.js reenvía los
 * parámetros desconocidos al servidor como GUCs, y el servidor rechaza la
 * conexión con «unrecognized configuration parameter». Aquí se separan: los
 * de cliente se traducen a opciones y el resto se deja en la URL.
 */

/** Parámetros que libpq interpreta en el cliente y el servidor no conoce. */
const CLIENT_ONLY_PARAMS = new Set([
  'sslmode',
  'ssl',
  'sslcert',
  'sslkey',
  'sslrootcert',
  'channel_binding',
  'connect_timeout',
  'target_session_attrs',
  'gssencmode',
  'krbsrvname',
  'passfile',
  'service',
]);

/**
 * `sslmode` → opción `ssl` de postgres.js.
 * @param {string|null} sslmode
 */
function sslOption(sslmode) {
  switch ((sslmode ?? '').toLowerCase()) {
    case '':
      return undefined;
    case 'disable':
      return false;
    case 'allow':
    case 'prefer':
      return 'prefer';
    case 'verify-ca':
    case 'verify-full':
      // postgres.js valida la cadena de certificados con `true`.
      return true;
    case 'require':
    default:
      return 'require';
  }
}

/**
 * @param {string} rawUrl
 * @returns {{url: string, options: {ssl?: boolean|string, connect_timeout?: number}}}
 */
export function parsePostgresUrl(rawUrl) {
  const options = {};
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    // Si no es una URL válida se devuelve tal cual: que falle el driver con
    // su propio mensaje, más claro que uno inventado aquí.
    return {url: rawUrl, options};
  }

  const sslmode = url.searchParams.get('sslmode');
  const ssl = sslOption(sslmode);
  if (ssl !== undefined) options.ssl = ssl;

  const timeout = Number(url.searchParams.get('connect_timeout'));
  if (Number.isFinite(timeout) && timeout > 0) options.connect_timeout = timeout;

  for (const name of [...url.searchParams.keys()]) {
    if (CLIENT_ONLY_PARAMS.has(name.toLowerCase())) url.searchParams.delete(name);
  }

  return {url: url.toString(), options};
}
