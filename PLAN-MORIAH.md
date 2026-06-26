# Plan ejecutable — Tienda Café MORIAH

> Documento maestro para construir el e-commerce de **MORIAH Café**.
> Sintetiza el framework StoreForge + benchmark de los mejores e-commerce de
> café de especialidad (Pergamino, Juan Valdez, Colo, Café Britt, BUNA, Orfeu,
> Coffee Mais). Sirve como roadmap retomable: cualquiera (o Claude en otra
> sesión) puede leer este archivo y continuar la ejecución.
>
> **Proyecto:** `storefront/` (Shopify Hydrogen headless · React Router 7 · Oxygen)
> **Fuente de marca:** cafemoriah.com (descargado en `.firecrawl/cafemoriah.com/`)
> **Última actualización del estado:** ver sección "Estado actual".

---

## 1. Objetivo y decisiones tomadas

| Decisión | Valor |
|---|---|
| Plataforma | **Shopify** (todos los competidores top la usan) |
| Storefront | **Hydrogen headless** (React Router 7 + Oxygen), repo conectado a GitHub |
| Pasarela | **Real** — Wompi o Mercado Pago para aceptar **PSE + Nequi + tarjeta** |
| Suscripción (Club Moriah) | **15% off** + frecuencia **2/4/6 semanas** + **regalo en 1er pedido** + pausar/cancelar |
| Envío gratis | desde **$100.000 COP** (lo que ya promete el sitio) |
| Idioma | Español (Colombia) |
| Catálogo inicial | Solo los **3 cafés reales** + 1 **kit bundle −15%** |

### Targets (StoreForge)
- Build < 4 h · CVR > 2.5% · LCP < 2.5s · 100% eventos de funnel.

---

## 2. Síntesis del benchmark (qué copiar / adaptar / ganar)

### Patrones universales (copiar)
1. **Shopify** + tema/storefront limpio.
2. **Suscripción = corazón del negocio.** Club con descuento y frecuencia flexible.
3. **Catálogo de dos pisos / escalera de 3 peldaños:** casa accesible → origen especial (+10%) → micro-lote premium (+20%). Bundle con % en el nombre para subir AOV.
4. **Storytelling de un solo mensaje** + **el nombre como historia**.
5. **Fricción cero** en envío (umbral claro) y pago (PSE/Nequi local).

### Anatomía del PDP (estilo Pergamino — "su mejor arma")
1. Ecualizador visual de tostión.
2. Nombre + subtítulo de origen.
3. Rating + nº de reseñas **arriba del precio**.
4. Ficha técnica: **Proceso · Variedad · Altitud**.
5. Selectores: **gramaje → molienda → (postal/regalo)**.
6. Botón compra + (retiro en tienda si aplica).
7. Bloque **Productor** con foto + **Altitud**.
8. **Historia del café con especificidad** (año, vereda, cooperativa, nº productores, msnm). *Especificidad = credibilidad.*

### UX de conversión recurrente
- Quiz "¿qué café va contigo?" · selección de molienda · WhatsApp como canal · reviews visibles · nota de regalo en carrito · banners de lanzamiento.

### Dónde MORIAH le GANA a los competidores
1. **Suscripción con pago local (PSE/Nequi vía Wompi/Mercado Pago)** — Pergamino solo cobra con tarjeta. Hueco más grande del mercado.
2. **Descuento por suscribirse + regalo** (modelo Café Britt) — Pergamino solo vende conveniencia.
3. **WhatsApp commerce de verdad** (pedido y re-pedido).
4. **Sin dependencia de tiendas físicas** → ataca Bogotá/Barranquilla/Cali con envío nacional impecable + comunidad digital.

---

## 3. Marca

- **Nombre como historia:** *"Moriah, el monte de la provisión"* — lo esencial llega cuando más se necesita. Sección "¿Por qué Moriah?" en home y empaque.
- **Mensaje:** "Un café para el alma. En cada grano, una promesa. En cada taza, provisión."
- **Identidad visual** (extraída del logo/sitio):
  - Verde pino `#13362B` · oro `#C9A24B` · crema `#F7F3EA` · tinta `#1A1A1A`.
  - Tipografía: **Fraunces** (display serif) + **Inter** (texto).
  - Logo: emblema circular dorado (montaña Moriah + olas + "2025").
  - Cero emojis → íconos SVG.

### Catálogo (datos reales en `app/data/cafes.js`)
| Café | Tier | Precio (340g) | Origen | Proceso/Variedad | Notas |
|---|---|---|---|---|---|
| Bourbon Rosado | De la casa | $45.000 | Finca La Esmeralda, Antioquia | Lavado / Bourbon Rosado | Chocolate, Piel de Naranja, Grosella Negra, Toronja |
| Blend Castillo Caturra | Origen especial | $52.000 | Finca La Esmeralda, Antioquia | Honey / Castillo y Caturra | Chocolate, Piel de Naranja, Uva |
| Geisha | Micro-lote | $75.000 | Finca San Rafael | Lavado / Geisha | Flor de Jamaica, Tomillo, Toronjil |
| **Kit Tres Orígenes** | Bundle −15% | ~$146.200 | — | los 3 | regalo / degustación |

> ⚠️ `altitude`, `producer`, `variety`, `story` en el seed son **placeholders** —
> reemplazar con datos reales de finca para máxima credibilidad (estilo El Bombo).

---

## 4. Estado actual de la implementación

### ✅ Hecho y validado (build de producción verde, probado con Playwright)
- Scaffold Hydrogen + alias `~` explícito en `vite.config.js` (necesario por el espacio en la ruta "Moriah E-commerce").
- Design system completo (`app/styles/`: tokens, base, components, layout, home, product).
- Header (logo, nav, búsqueda, carrito) · Footer (marca, links, newsletter, redes, pagos) · Announcement bar.
- **Home:** hero "Un café para el alma" + stats · proceso · value props · historia · envíos · reseñas · newsletter.
- **PDP** base (galería, variantes, sticky ATC, trust badges, acordeones, reseñas, JSON-LD).
- **Colección** con orden y paginación.
- **Carrito** slide-out con **barra de envío gratis** ($100.000).
- SEO (JSON-LD Organization/Product, OG, canonical) · **Tracking** GA4 + Meta Pixel (dormido hasta setear IDs) · CSP.
- `.env.example` + `README.md` con pasos de conexión y deploy.
- **Catálogo local:** solo los 3 cafés reales (reemplaza Mock.shop). Auto-switch a Shopify cuando exista la colección `cafes`.

### ✅ Fase A completada (2026-06-12 — build verde + validado con Playwright)
- **Seed v2** (`app/data/cafes.js`): tiers, tamaños (340/500g), moliendas, config de suscripción, BUNDLE. ✅
- **PDP estilo Pergamino** (`SeedProductPage`): RoastMeter, ficha técnica (proceso/variedad/altitud), bloque productor, historia, **PurchaseOptions** (compra única / suscripción −15% + frecuencia + gramaje + molienda + cantidad + nota de regalo + CTA WhatsApp con detalle). ✅ validado.
- **Home:** sección **Club Moriah**, **¿Por qué Moriah?**, **catálogo dos pisos** (Línea de Origen / Micro-lotes) + **BundleCard** + **CTA del quiz** ("¿No sabes cuál elegir? Haz el test de 3 preguntas" → `/quiz`). ✅ validado.
- **PDP del bundle** (`/products/kit-tres-origenes`). ✅ validado.
- **Quiz** `/quiz` "¿Qué café va contigo?". ✅ validado.
- Nav actualizada (Cafés · Club Moriah · Encuentra tu café · Nuestra Historia · Envíos). ✅
- **Fix nav/footer Mock.shop:** `Header.jsx` y `Footer.jsx` ahora ignoran el menú demo de Mock.shop (Men/Woman/Unisex, Privacy Policy…) y usan los menús MORIAH hasta que `PUBLIC_STORE_DOMAIN` apunte a la tienda real. ✅
- **Pagos locales:** announcement bar dice "Paga con Nequi, PSE o tarjeta" (el PDP ya lo tenía). ✅
- **Página `/pages/nuestra-historia`:** fallback local (`app/components/StoryPage.jsx` + `SEED_PAGES` en `pages.$handle.jsx`) — hero, "El nombre es la historia", equipo, valores, CTA doble (cafés/quiz). Cuando la página exista en Shopify, la reemplaza sola. ✅ validado.
- Screenshots de validación en la raíz del proyecto: `validate-home-desktop.jpeg`, `validate-home-nav.jpeg`, `validate-home-mobile.jpeg`, `validate-pdp.jpeg`, `validate-quiz.jpeg`, `validate-collection.jpeg`, `validate-bundle.jpeg`, `validate-historia.jpeg`.
- Nota: en dev aparece un warning de hidratación de Suspense (carrito diferido de Hydrogen) — benigno y conocido, no introducido por estos cambios.
- **Brand assets reales integrados (2026-06-12):** fotos del empaque nuevo (bolsa verde con turpial) desde `brand-assets/` convertidas a WebP en `public/images/`:
  - `producto-bolsa.webp` (packshot fondo blanco) → imagen de los 3 cafés (cards + PDP).
  - `hero-lifestyle.webp` (bolsa en mano, "Un café para el alma") → hero de la home.
  - `kit-bolsas.webp` (frente + reverso sobre beige) → Kit Tres Orígenes.
  - `lineup-bolsas.webp` (lineup en estante) → "Un propósito compartido" (home).
  - `monte-moriah.webp` (bolsa sobre montañas) → "El nombre es la historia" (/pages/nuestra-historia).
  - `tostado-moriah.webp` (tambor de tostión) → "Un grupo de amigos, un sueño" (/pages/nuestra-historia).
  - Fix CSS: `.hero__media img` pisaba el tamaño del sello `.hero__seal` (se estiraba al 100%); ahora `img.hero__seal` tiene su propia regla.
  - Las imágenes viejas (`cafe-bolsa`, `cafe-cafes`, `equipo-moriah`, `hero-bolsa`) quedaron sin referencias (empaque antiguo) pero siguen en `public/images/`.
- **Fix overflow horizontal en mobile (2026-06-12):** la página scrolleaba de lado en <900px (scrollWidth 626px vs viewport 360px). Tres causas corregidas:
  1. `.valueprops` forzaba 4 columnas sin breakpoint → ahora 2×2 en mobile (`components.css`).
  2. `.products-grid` mobile usaba `1fr 1fr` (los items no pueden encogerse bajo min-content) → `repeat(2, minmax(0, 1fr))` + `flex-wrap` en `.product-card__foot` (`home.css`/`components.css`).
  3. `.newsletter-form input` sin `min-width: 0` empujaba el botón fuera del viewport.
  4. Defensivo: `.overlay` (drawer carrito/búsqueda/menú) ahora tiene `overflow: hidden` para que el aside off-canvas nunca ensanche el área scrolleable.
  - Validado: scrollWidth == viewport en home/PDP/bundle/quiz/colección/historia a 375px y 320px.
- **Pendiente opcional de Fase A:** fotos individuales por café (los 3 comparten el mismo packshot nuevo; faltaría una foto por variedad).

### Componentes/archivos clave creados
```
app/data/cafes.js                 # catálogo + reglas de negocio (suscripción, bundle, sizes, grinds)
app/components/CafeCard.jsx        # tarjeta de café (seed)
app/components/BundleCard.jsx      # tarjeta del kit
app/components/PurchaseOptions.jsx # caja de compra interactiva (suscripción/molienda/gramaje/regalo)
app/components/RoastMeter.jsx      # ecualizador de tostión
app/components/Tracking.jsx        # GA4 + Meta Pixel + bridge de eventos
app/components/FreeShipBar.jsx     # barra de envío gratis del carrito
app/components/AnnouncementBar.jsx
app/components/Icons.jsx           # set SVG (sin emojis)
app/routes/_index.jsx              # home
app/routes/products.$handle.jsx    # PDP (Shopify + seed + bundle)
app/routes/collections.$handle.jsx # colección (Shopify + seed)
app/routes/quiz.jsx                # quiz
```

---

## 5. Roadmap pendiente (orden de ejecución sugerido)

### Fase A — Rematar el storefront local (sin Shopify) — ✅ COMPLETADA (2026-06-12)
1. [x] Añadir CTA del quiz en la home (link "¿No sabes cuál elegir? Haz el test" → `/quiz`).
2. [x] Mensajería de pagos locales (Nequi/PSE) en announcement/PDP.
3. [x] `npm run build` verde + screenshots de validación (desktop + mobile).
4. [x] Página `/pages/nuestra-historia` ("¿Por qué Moriah?" extendida — fallback local hasta crearla en Shopify).
5. [ ] (Opcional) fotos individuales por café (hoy los 3 comparten la misma bolsa).
6. [x] *(Extra)* Header/Footer ignoran el menú demo de Mock.shop y muestran los menús MORIAH.

### Fase B — Conectar Shopify real
6. [x] `npx shopify hydrogen link` → `npx shopify hydrogen env pull`. ✅ (2026-06-12)
   - Tienda: **jbsppv-ie.myshopify.com** ("Mi tienda") · storefront Hydrogen: **Cafe-Moriah** · cuenta matteotaofr@gmail.com.
   - `.env` poblado (no se commitea). Conexión verificada vía Storefront API: responde, pero la tienda está **vacía** (sin productos, sin colección `cafes`) → el seed local sigue activo, como se diseñó.
   - Ajuste: Header/Footer ahora usan el menú de Shopify **solo si está personalizado para MORIAH** (algún link a `/collections/cafes`, `/quiz` o `nuestra-historia`); si no, mantienen el nav MORIAH en código. Evita que el menú por defecto de una tienda nueva ("Inicio/Catálogo/Contacto") pise la navegación.
   - Pendientes de tienda: renombrar "Mi tienda" → MORIAH Café, moneda COP + impuestos incluidos, idioma español.
7. [x] Colección `cafes` + 3 productos creados **vía Admin API** (2026-06-12). ✅
   - Script idempotente: `storefront/scripts/seed-shopify.mjs` (client credentials de la app `moriah-seed` del Dev Dashboard; se corre con `SHOP=... CLIENT_ID=... CLIENT_SECRET=... node scripts/seed-shopify.mjs`).
   - Variantes gramaje 340/500g × 4 moliendas, precios escalera (45k/52k/75k; 500g = ×1.4), imágenes (packshot), metafields `custom` **con definiciones `PUBLIC_READ`** (sin definición, el Storefront API devuelve null).
   - ⚠️ Falta config de tienda en admin: impuestos incluidos en el precio, nombre de tienda ("Mi tienda" → MORIAH Café).
8. [x] Bundle "Kit Tres Orígenes" creado: $146.200 (compareAt $172.000). ✅
9. [x] Storefront verificado con productos reales: home (escalera por precio + badges), PDP (variantes, ficha desde metafields, ATC real), 0 errores de consola. ✅
   - **Fixes durante el switch:** (a) `Money` de Hydrogen causaba mismatch de hidratación (ICU servidor formatea COP con 2 decimales, navegador con 0) → reemplazado por `app/components/Money.jsx` (formatCop es-CO) en los 9 archivos que lo usaban; (b) `PUBLIC_CHECKOUT_DOMAIN` añadido al `.env` (analytics lo exige); (c) Shopify ordena tags alfabéticamente → badge por lista de prioridad en `ProductItem` (`BADGE_PRIORITY`); (d) home ordena por `sortKey: PRICE` (escalera).

### Fase C — Pasarela + suscripción + cobro local (la ventaja competitiva)
10. [ ] Integrar **Wompi** o **Mercado Pago** (PSE, Nequi, tarjeta) en checkout de Shopify.
11. [ ] App de **suscripciones** (Appstle / Seal Subscriptions / Recharge) con cobro recurrente y, si es posible, **cobro recurrente con Nequi/PSE**.
12. [ ] Cablear los **selling plans** en el PDP de Hydrogen (reemplazar el CTA WhatsApp del seed por ATC real con plan de suscripción).
13. [ ] Colección `/collections/suscripciones` + badge "Disponible para suscripción" en tarjetas.

### Fase D — Confianza y retención
14. [ ] **Reviews**: Judge.me (gratis) — rating + conteo arriba del precio.
15. [ ] **Nota de regalo** real en el carrito (cart attribute) + **postal** opcional.
16. [ ] **Programa de puntos** (Smile.io) cuando haya ventas recurrentes.
17. [ ] **Blog educativo** (5 artículos fundacionales): "¿Por dónde empiezo?", métodos de preparación, tu origen, proceso lavado/honey/natural, cómo leer la etiqueta. Reciclar como contenido IG/WhatsApp.

### Fase E — Lanzamiento y growth
18. [ ] WhatsApp commerce (catálogo + re-pedido).
19. [ ] Secuencia de carrito abandonado (1h / 24h / 72h).
20. [ ] Banners de lanzamiento rotativos en home (ediciones, cold brew, etc.).
21. [ ] A/B testing (CTA, hero, umbral envío, layout PDP, popup).

---

## 6. Notas técnicas (imprescindibles)

- **Ruta con espacio:** el proyecto vive en `Moriah E-commerce` (con espacio). Por eso `vite.config.js` define `resolve.alias['~'] = fileURLToPath(new URL('./app', import.meta.url))`. **No eliminar** o el dev server local no resuelve módulos.
- **Money inline:** usar siempre `<Money as="span" .../>` dentro de `<p>`/`<span>` (por defecto renderiza `<div>` → rompe hidratación).
- **Atributo `hidden`:** si un componente tiene `display:flex` en CSS, añadir `.clase[hidden]{display:none}`.
- **CSP:** fuentes Google y GA/Meta ya permitidos en `app/entry.server.jsx`. Añadir ahí los dominios de Wompi/Mercado Pago/Judge.me al integrarlos.
- **Seed → Shopify:** la lógica de fallback vive en `_index.jsx` (HOME_CAFES_QUERY), `collections.$handle.jsx` (SEED_HANDLES) y `products.$handle.jsx` (getCafe/BUNDLE). Cuando Shopify devuelva productos, el seed se ignora solo.
- **Tracking:** setear `PUBLIC_GA4_ID` / `PUBLIC_META_PIXEL_ID` en `.env` activa GA4 + Meta Pixel. El evento `purchase` lo dispara el checkout de Shopify (Customer Events / canal Meta con CAPI), no el storefront.
- **Deploy:** push a la rama conectada → **Oxygen** construye desde GitHub. Variables `PUBLIC_*`/`PRIVATE_*` se inyectan desde el panel de Hydrogen (no se commitean).

### Comandos
```bash
cd storefront
npm install
npm run dev        # http://localhost:3000 (Mock.shop hasta conectar)
npm run build      # build de producción (gate de validación)
npx shopify hydrogen link      # conectar la tienda real
npx shopify hydrogen env pull  # traer variables de entorno
```

---

## 7. Cómo retomar este plan en otra sesión

1. Abrir el proyecto y leer este archivo + `storefront/README.md`.
2. Revisar "Estado actual" (sección 4) para saber qué falta.
3. Continuar por la **Fase A** (rematar local) → validar con `npm run build` + screenshots.
4. Avanzar a **Fase B/C** cuando haya tokens de Shopify + decisión de pasarela.
5. Mantener el principio StoreForge: **clarity > trust > speed > friction removal**, y la ventaja MORIAH: **suscripción con pago local + WhatsApp + nacional**.
