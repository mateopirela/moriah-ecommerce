# Plantilla Tropicalia → MORIAH

Deconstrucción completa de **tropicaliacoffee.com** convertida en plantilla reutilizable,
vestida con la marca MORIAH. Implementada en el storefront Hydrogen.

> **Criterio:** se replica fielmente el **diseño, distribución, tipografía y patrones de UI**
> (estructura funcional, no propietaria). Se sustituye todo el **contenido propietario** de
> Tropicalia (fotos, copy textual, logo) por el de MORIAH (brandboard + narrativa + productos).

---

## 1. Plataforma & stack del original

- **Tropicalia:** Shopify + assets exportados de **Webflow** (clases Webflow, `webflow-icons`).
- **MORIAH:** Shopify **Hydrogen** (React Router 7). La plantilla vive en una capa CSS
  independiente (`app/styles/tropicalia.css`, scope `.tx`) cargada al final.

## 2. Sistema de diseño (extraído del DOM real)

### Color — Tropicalia → MORIAH
| Rol | Tropicalia | MORIAH (brandboard) |
|---|---|---|
| Fondo | `--beige-fondo #fff7e7` | `#fff7e7` (≈ Alabaster `#f0debd`) |
| Superficie | `--beige #fbefdb` | `#fbefdb` |
| Acento primario | `--dordado #b36d18` | **Ochre `#cf8e08`** |
| Acento profundo | `--azul #0b3959` | **Verde Pino `#19332f`** |
| Acento puntual | `--rojo-fomr #b3181b` | `#b3181b` (sale) |
| Texto | `#333` | `#2a2a2a` |

### Tipografía
| Rol | Tropicalia | MORIAH (plantilla) |
|---|---|---|
| Display | **VTC Carrie** (`vtccarrie-regular.otf`) — hecho a mano, MAYÚSCULAS, weight 400 | `@font-face` VTC Carrie en `/public/fonts/` + fallback **Caveat Brush** |
| Cuerpo | **Karla** (300–800) | **Karla** (idéntico, Google Fonts) |
| Secundaria | Terital United / Montserrat | — |

- **Escala display:** H1 ~63px · H2 ~40px · H3 ~32px — todo `text-transform: uppercase`.
- **Botón firma:** pill dorado, mayúsculas, `letter-spacing` ancho, texto pequeño (≈0.72rem).

> Para el look **exacto**: licenciar VTC Carrie y dejar `vtccarrie-regular.otf` en
> `storefront/public/fonts/`. El `@font-face` ya lo referencia; cae a Caveat Brush si falta.

## 3. Blueprint de la home (orden 1:1)

| # | Sección Tropicalia | Adaptación MORIAH | Layout |
|---|---|---|---|
| 1 | Announcement bar | Envío gratis · Nequi/PSE · 100% colombiano | barra superior |
| 2 | Navbar (CAFÉ▾ MERCH▾ CATACIÓN PREPARA TU CAFÉ TIENDA BLOG CONTACTO) | mismos items + dropdowns | sticky, logo izq · iconos der |
| 3 | Hero "UN LUJO TROPICAL" + CONOCE MÁS | **"UN CAFÉ PARA EL ALMA"** | split full-bleed 2 imágenes, overlay izq |
| 4 | 4 colecciones (Trópico/Esencia/Privilegio/Vino) | Línea de Origen · Micro-lotes · Club · Kit El Legado | grid 4-col, card img+desc+CTA |
| 5 | Suscripciones "Suscríbete ahora" | **Club de la Memoria** | split texto/imagen, fondo verde pino |
| 6 | "NUESTROS INFALTABLES" (merch) | **Línea de merch** (Caja El Legado, Pocillo, Tote, Gorra) | grid 4-col producto + precio |
| 7 | Store gallery (7 fotos) | Galería lifestyle MORIAH | strip horizontal con scroll-snap |
| 8 | Menú café "INSPIRADOS EN NUESTRO TRÓPICO" | **"Rituales de la Pausa"** (Tinto de la Abuela, V60, Prensa Francesa) | grid 3-col |
| 9 | Footer multi-columna | marca+social · tienda · contacto · newsletter | grid 4-col, fondo verde pino |

## 4. Menús de navegación

- **Café ▾:** Todos · Línea de Origen · Micro-lotes · Club de la Memoria
- **Merch ▾:** Pocillos · Para vestir · Accesorios · Caja regalo
- Catación · Prepara tu café · Tienda · Blog · Contacto

## 5. Archivos implementados

| Archivo | Rol |
|---|---|
| `app/styles/tropicalia.css` | Tokens + todas las secciones + header/footer + responsive (scope `.tx`) |
| `app/routes/_index.jsx` | Home con la estructura Tropicalia + contenido MORIAH |
| `app/data/merch.js` | Catálogo de la línea de merch (5 productos) |
| `app/components/Header.jsx` | Navbar Tropicalia (dropdowns CAFÉ/MERCH) |
| `app/components/Footer.jsx` | Footer multi-columna con contacto |
| `app/root.jsx` | Fuentes (Karla + Caveat Brush) + stylesheet al final |

## 6. Pendientes para fidelidad total

1. **Fuente VTC Carrie:** subir `.otf` a `/public/fonts/` (hoy usa fallback).
2. **Fotografía:** reemplazar los `.webp` actuales por foto de producto/lifestyle de MORIAH
   en proporción 4:5 (cards), 1:1 (merch), 3:4 (galería).
3. **Productos reales:** conectar la colección `cafes` y crear la colección `merch` en Shopify.
4. **Breakpoints:** validado a 320/768/1024/1440 (grids colapsan 4→2→1).

## 7. Cómo previsualizar

```bash
cd storefront
npm run dev      # http://localhost:3001
npm run build    # verificación de producción
```
