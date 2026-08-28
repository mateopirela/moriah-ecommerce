# MORIAH Café — storefront

Tienda en línea de MORIAH Café. React Router 7 (framework mode) + Vite, sin
dependencias de Shopify: el catálogo vive en código, el carrito en una cookie
firmada, los pagos en **Wompi (Bancolombia)** y los pedidos/suscripciones en
Postgres vía Drizzle.

## Stack

| Capa | Tecnología |
| --- | --- |
| UI / SSR | React 18 · React Router 7 · Vite 8 |
| Catálogo | `app/data/cafes.js`, `app/data/merch.js` (fuente de verdad de precios y textos) |
| Carrito | Cookie firmada (`SESSION_SECRET`) — `app/lib/cart*.js` |
| Pagos únicos | Wompi Web Checkout (redirección) — `app/routes/checkout*.jsx` |
| Suscripciones | Tokenización de tarjeta + fuentes de pago Wompi — `app/routes/suscripcion*.jsx` |
| Base de datos | Postgres (Drizzle ORM). PGlite embebido en desarrollo. |
| Emails | Klaviyo (opcional) — eventos `Placed Order`, `Subscription Started`, … |
| Hosting | Proyecto existente en Vercel (Root Directory `storefront`) + Vercel Cron |

## Desarrollo

```bash
cp .env.example .env   # completa SESSION_SECRET y las llaves de Wompi
npm install
npm run dev            # http://localhost:5173
```

Sin `DATABASE_URL`, la app usa una base PGlite en `./.data` (se crea sola y se
migra al arrancar). Con `DATABASE_URL`, aplica las migraciones con
`npm run db:migrate`.

```bash
npm test               # vitest (firma/checksum Wompi, carrito, suscripciones)
npm run lint
npm run build          # build/ + manifiesto del preset de Vercel
npm run db:generate    # genera SQL en ./drizzle tras cambiar app/db/schema.js
```

## Flujo de pagos

1. **Compra única** — `/checkout` valida el formulario, crea el pedido
   (`orders`, estado `pending`) y redirige al Web Checkout de Wompi con la
   firma de integridad. Wompi vuelve a `/checkout/gracias?ref=…&id=…`, donde
   se consulta la transacción, se actualiza el pedido y se vacía el carrito.
2. **Club de la Memoria** — `/suscripcion` tokeniza la tarjeta en el navegador
   (llave pública), el servidor crea la fuente de pago y la suscripción, y
   ejecuta el primer cobro. El cron diario (`/api/cron/subscriptions`) cobra
   las suscripciones vencidas; 3 fallos seguidos → `past_due`.
3. **Webhook** — `/api/wompi/events` verifica el checksum, guarda el evento
   (idempotente) y sincroniza pedido + suscripción. Configura la URL en el
   panel de Wompi → Desarrolladores → Eventos.
4. **Gestión** — `/suscripcion/gestionar?token=…` (pausar, reanudar, cambiar
   frecuencia, cancelar). El enlace llega por correo (Klaviyo).

## Variables de entorno

Ver `.env.example`. Imprescindibles en producción: `SESSION_SECRET`,
`PUBLIC_SITE_URL`, `WOMPI_*`, `DATABASE_URL`, `CRON_SECRET`.

## Estructura

```
app/
  data/        catálogo, descuentos, políticas, departamentos
  db/          esquema Drizzle + cliente (Postgres / PGlite)
  lib/         catalog, cart, wompi, orders, subscriptions, klaviyo, analytics
  components/  UI (header, carrito, PDP, formularios)
  routes/      páginas, checkout, suscripción, APIs (cart-upsell, search, webhook, cron)
drizzle/       migraciones SQL generadas
scripts/       migrate.mjs (se ejecuta en el build de producción)
```
