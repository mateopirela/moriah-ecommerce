# MORIAH Café — Tienda (Shopify Hydrogen)

Storefront headless de **MORIAH Café** construido con [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) (React Router 7 + Oxygen). Diseño premium "Un café para el alma": verde pino + oro, tipografía editorial (Fraunces + Inter), checkout nativo de Shopify.

## Stack

- Hydrogen 2026.4 · React Router 7 · Oxygen (edge)
- Vite · Shopify CLI · GraphQL codegen
- CSS con design tokens (sin framework de utilidades)

## Requisitos

- Node.js 22 o 24

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:3000  (usa Mock.shop hasta que conectes la tienda)
```

> Nota: el proyecto vive en una ruta con espacio (`Moriah E-commerce`). Por eso
> `vite.config.js` define un alias explícito `~ → app`; no lo elimines o fallará
> la resolución de módulos en local.

## Conectar la tienda real (cafemoriah)

1. Autentícate y vincula la tienda:
   ```bash
   npx shopify auth login
   npx shopify hydrogen link        # elige la tienda cafemoriah
   npx shopify hydrogen env pull    # escribe las variables en .env
   ```
2. O copia `.env.example` a `.env` y completa los tokens del Storefront API
   (Shopify admin → Headless / Hydrogen channel).
3. Reinicia `npm run dev`. La home y la colección leerán productos reales.

### Datos que la tienda espera en Shopify

- **Colección con handle `cafes`** → alimenta la grilla "Nuestros cafés" y el nav.
- **Productos** (Bourbon Rosado, Geisha, Blend Catillo Caturra…) con:
  - Imágenes (la galería del PDP usa hasta 8).
  - Variantes (p. ej. tamaño 250g/500g/1kg, molienda grano/molido).
  - **Metafields** opcionales (namespace `custom`) que enriquecen el PDP:
    | key | ejemplo |
    |-----|---------|
    | `flavor_notes` | Chocolate, Piel de Naranja, Grosella Negra |
    | `origin` | Finca La Esmeralda, Colombia |
    | `roast` | Tueste Medio |
    | `process` | Lavado / Honey / Natural |
    | `altitude` | 1.700–1.900 msnm |
- **Menú `main-menu`** (opcional): si no existe, se usa el menú de respaldo
  (Cafés · Tienda · Nuestra Historia · Proceso · Envíos).

## Tracking (opcional)

Define en `.env` para activar GA4 + Meta Pixel conectados a los eventos de
funnel (`view_item`, `add_to_cart`, `search`, `page_view`):

```
PUBLIC_GA4_ID="G-XXXXXXXX"
PUBLIC_META_PIXEL_ID="123456789"
```

El evento **purchase** lo dispara el checkout de Shopify (Customer Events / canal
de Meta con CAPI), no este storefront — actívalo en el admin de Shopify.

## Build y deploy

```bash
npm run build        # build de producción (Oxygen)
npm run preview      # previsualiza el build localmente
```

Deploy automático: al hacer push a la rama conectada, **Oxygen** construye y
publica desde GitHub. Las variables `PUBLIC_*`/`PRIVATE_*` se inyectan desde el
panel de Hydrogen en el admin de Shopify (no se commitean).

## Estructura

```
app/
├── components/        # Header, Footer, Cart, ProductForm, Gallery, StickyAtc, Icons, Tracking…
├── routes/            # _index (home), products.$handle (PDP), collections.$handle, cart…
├── styles/            # tokens · base · components · layout · home · product (design system)
└── root.jsx           # fuentes, CSS, analytics, CSP
public/images/         # logo + fotografía de marca (optimizada a webp)
```

---

Diseño y build siguiendo el framework StoreForge (clarity > trust > speed > friction).
