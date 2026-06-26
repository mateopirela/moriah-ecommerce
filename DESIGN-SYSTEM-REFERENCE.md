# MORIAH Café — Premium Design System Reference

Quick reference for developers maintaining the premium aesthetic.

---

## Color System

### Primary Palette
- **Verde Pino #13362B** — Primary dark surface (hero, club section)
- **Oro #C9A24B** — Accent (buttons, hover states, form focus)
- **Crema #F7F3EA** — Light background, breathing room
- **Tinta #1A1A1A** — Body text (never pure black)

### Usage Rules
- **Verde:** Background, sections, structural
- **Oro:** Interactive states, accents, glow effects (not backgrounds)
- **Crema:** Negative space, contrast against dark
- **Tinta:** Text on light, subtle emphasis

### Semantic Colors
- **Success:** #3F7D52 (green, success messages)
- **Error:** #FF6B6B (warm red, form errors)
- **Sale:** #B5402F (warm red, price strikethrough)

---

## Typography System

### Font Families
- **Display:** Fraunces (serif) — Headlines, hero, emotional impact
- **Body:** Inter (sans) — Copy, UI, clarity

### Type Scale

| Use | Token | Size | Line-height | Weight |
|-----|-------|------|-------------|--------|
| Hero | `--text-hero` | clamp(2.75rem, 1.4rem + 6.4vw, 5.5rem) | 0.98 | 600 |
| H2 | `--text-h2` | clamp(1.9rem, 1.3rem + 2.6vw, 2.75rem) | 1.1 | 600 |
| H3 | `--text-h3` | clamp(1.35rem, 1.1rem + 1vw, 1.75rem) | 1.15 | 600 |
| Body | `--text-base` | clamp(1rem, 0.96rem + 0.2vw, 1.0625rem) | 1.6 | 400 |
| Lede | `--text-lg` | clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem) | 1.6 | 400 |
| Price | `--text-price` | clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem) | 1 | 700 |
| Eyebrow | `--text-eyebrow` | 0.75rem | 1 | 600 |

### Usage Examples

**Headings:**
```html
<!-- Hero scale -->
<h1 class="hero__title">Main narrative</h1>

<!-- Section heading -->
<h2 class="display-h2">Section topic</h2>

<!-- Subheading -->
<h3 class="display-h3">Subsection</h3>
```

**Body & Emphasis:**
```html
<!-- Lead paragraph -->
<p class="lede">Introductory context...</p>

<!-- Regular body (implicit) -->
<p>Body text uses --text-base by default</p>

<!-- Eyebrow label -->
<span class="eyebrow">Category or label</span>
```

---

## Shadow System

### Elevation Levels

| Use | Token | Shadow |
|-----|-------|--------|
| Subtle | `--shadow-sm` | 0 1px 2px rgba(12,36,28,0.06) |
| Medium | `--shadow-md` | 0 10px 30px -12px rgba(12,36,28,0.25) |
| Large | `--shadow-lg` | 0 30px 60px -20px rgba(12,36,28,0.35) |
| Extra Large | `--shadow-xl` | 0 50px 100px -30px rgba(12,36,28,0.4) |
| Floating | `--shadow-floating` | 0 20px 50px -15px rgba(12,36,28,0.3) |
| Glow | `--shadow-glow` | 0 0 40px rgba(201,162,75,0.15) |

### Application

```css
/* Card elevation */
.card {
  box-shadow: var(--shadow-md);
}
.card:hover {
  box-shadow: var(--shadow-lg);
}

/* Hero image */
.hero__media {
  box-shadow: var(--shadow-xl);
}

/* Gold glow (buttons, inputs) */
input:focus {
  box-shadow: 0 0 20px rgba(201,162,75,0.2);
}
```

---

## Motion & Animation

### Timing

| Token | Duration | Use |
|-------|----------|-----|
| `--dur-micro` | 150ms | Instant feedback (hover) |
| `--dur-fast` | 200ms | Quick transitions |
| `--dur` | 320ms | Standard micro-interactions |
| `--dur-slow` | 600ms | Image scale transitions |
| `--dur-entrance` | 800ms | Page load sequences |

### Easing Functions

| Token | Cubic-bezier | Use |
|-------|--------------|-----|
| `--ease` | (0.16, 1, 0.3, 1) | Smooth exit (default) |
| `--ease-out-expo` | (0.16, 1, 0.3, 1) | Dramatic reveals |
| `--ease-out-cubic` | (0.33, 1, 0.68, 1) | Entrance animations |
| `--ease-in-quad` | (0.11, 0, 0.5, 0) | Easing in |

### Animation Patterns

**Entrance Stagger:**
```css
.element {
  animation: fadeInUp var(--dur-entrance) var(--ease-out-cubic) var(--delay) both;
}

/* nth-child delays */
.element:nth-child(1) { --delay: 0.1s; }
.element:nth-child(2) { --delay: 0.25s; }
.element:nth-child(3) { --delay: 0.4s; }
```

**Hover Lift:**
```css
.card {
  transition: transform var(--dur) var(--ease), 
              box-shadow var(--dur) var(--ease);
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}
```

**Focus Glow:**
```css
input:focus {
  transition: all var(--dur) var(--ease-out-cubic);
  border-color: var(--gold-400);
  box-shadow: 0 0 20px rgba(201,162,75,0.2);
}
```

---

## Component Patterns

### Buttons

**Base style:**
```css
.btn {
  padding: 0.95rem 1.75rem;
  min-height: 52px;
  border-radius: var(--r-pill);
  background: var(--primary);
  box-shadow: 0 4px 12px rgba(201,162,75,0.2);
  transition: transform var(--dur-fast), background var(--dur-fast), 
              box-shadow var(--dur);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(201,162,75,0.3);
}
```

**Variants:**
- `.btn--lg` — Larger padding (1.1rem 2.25rem), min-height 58px
- `.btn--outline-gold` — Transparent bg, gold border
- `.btn--dark` — Pine-800 bg, cream text
- `.btn--ghost` — Transparent, bordered
- `.btn--memory` — Full width form button

### Cards

**Product card:**
```css
.product-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: 0 4px 15px rgba(12,36,28,0.08);
  transition: transform var(--dur), box-shadow var(--dur), border-color var(--dur);
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
  border-color: var(--gold-300);
}

.product-card__media img {
  transition: transform var(--dur-slow) var(--ease);
}

.product-card:hover .product-card__media img {
  transform: scale(1.08);
}
```

### Forms

**Premium input styling:**
```css
input, textarea {
  padding: 1.2rem;
  border: 2px solid rgba(201,162,75,0.3);
  border-radius: 12px;
  background: rgba(247,243,234,0.05);
  backdrop-filter: blur(10px);
  transition: all var(--dur) var(--ease-out-cubic);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--gold-400);
  background: rgba(247,243,234,0.08);
  box-shadow: 0 0 20px rgba(201,162,75,0.2);
}
```

### Links

**Arrow link with animated underline:**
```css
.link-arrow {
  position: relative;
  border-bottom: 2px solid transparent;
  transition: color var(--dur) var(--ease-out-cubic);
}

.link-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--gold-400));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur) var(--ease-out-cubic);
}

.link-arrow:hover::after {
  transform: scaleX(1);
}
```

---

## Spacing System

### Scale (8px base)

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 0.25rem (2px) | Minimal gaps |
| `--space-2` | 0.5rem (4px) | Small gaps |
| `--space-3` | 1rem (8px) | Default gap |
| `--space-4` | 1.5rem (12px) | Component padding |
| `--space-5` | 2rem (16px) | Generous padding |
| `--space-6` | 3rem (24px) | Section spacing |
| `--space-7` | 4rem (32px) | Large sections |
| `--space-section` | clamp(4rem, 3rem + 5vw, 7.5rem) | Section padding |
| `--space-hero` | clamp(5rem, 3rem + 8vw, 9rem) | Hero padding |

---

## Border Radius System

| Token | Value | Use |
|-------|-------|-----|
| `--r-sm` | 6px | Small inputs |
| `--r-md` | 12px | Form elements |
| `--r-lg` | 20px | Cards, images |
| `--r-pill` | 999px | Buttons, pills |

---

## Responsive Breakpoints

Common patterns used:
- `max-width: 900px` — Desktop to tablet
- `max-width: 800px` — Larger tablets
- `max-width: 700px` — Small tablets
- `max-width: 560px` — Phones
- `max-width: 480px` — Small phones

Example:
```css
.grid {
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Accessibility Standards

### Focus States
All interactive elements have visible focus rings:
```css
:focus-visible {
  outline: 2px solid var(--gold-500);
  outline-offset: 3px;
}
```

### Reduced Motion
Animations respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

### Color Contrast
- Text on light: #1A1A1A (Tinta) on #F7F3EA (Crema) — 13.5:1
- Text on dark: #F7F3EA (Crema) on #13362B (Verde) — 11.2:1
- Buttons: Gold on Tinta — 4.8:1

---

## Common Patterns

### Hero Section
1. Dark gradient background (135deg)
2. Radial light overlay (80% 10%, 800px radius)
3. Film grain texture (2% opacity)
4. Staggered content reveals (100–200ms apart)
5. Image with overlay + hover scale

### Club/Feature Section
1. Asymmetric grid (often 1.3fr : 0.7fr)
2. Background accent gradient (subtle, not dominant)
3. Card with gradient background + shadow
4. Large, dramatic headline (Fraunces)
5. Icon with hover animation

### Card Grids
1. 3-column → 2-column → 1-column responsive
2. Lift on hover (translateY(-8px to -10px))
3. Shadow depth increase
4. Border color shift to gold
5. Image scale (1.05x–1.08x)

### Forms
1. Dark background (#13362B or similar)
2. Inputs with 2px gold borders
3. Focus: border bright gold + shadow glow
4. Backdrop-filter blur for depth
5. Success message with gradient background

---

## File Organization

```
app/styles/
├── tokens.css       ← Color, spacing, motion, shadows
├── base.css         ← Typography, resets, layout
├── reset.css        ← Browser reset
├── layout.css       ← Page structure
├── home.css         ← Homepage sections (hero, club, etc)
├── product.css      ← Product pages
├── components.css   ← Buttons, cards, forms, links
└── app.css          ← Global imports

app/components/
├── MemoryForm.jsx   ← Form component (uses premium styling)
├── Header.jsx       ← Navigation
├── CafeCard.jsx     ← Card component
└── ...
```

---

## Maintenance Tips

### Updating Colors
Change in `tokens.css` root variables. All uses update globally.
```css
--gold-500: #c9a24b; /* change once, affects entire site */
```

### Adjusting Animations
Change timing in `tokens.css` variables:
```css
--dur: 320ms;     /* adjust micro-interaction speed */
--dur-slow: 600ms; /* adjust image transitions */
```

### Adding New Components
1. Use existing tokens (color, shadow, spacing, motion)
2. Follow hover pattern: lift + shadow + border color
3. Add focus states for interactive elements
4. Test with `@media (prefers-reduced-motion: reduce)`
5. Verify responsive breakpoints

### Testing Premium Feel
- [ ] Hover effects have 3D lift (translateY)
- [ ] Shadows increase on hover
- [ ] Gold accents appear on interactive states
- [ ] Text scales appropriately (Fraunces for display)
- [ ] Animations are 200–600ms (not instant, not slow)
- [ ] Focus rings are visible and on-brand
- [ ] Mobile responsive maintains visual hierarchy

---

## Resources

- **Figma:** MORIAH design system (if available)
- **Colors:** MORIAH brand guidelines
- **Fonts:** Fraunces (Google Fonts), Inter (Google Fonts)
- **Icons:** Custom SVGs in `/app/components/Icons.jsx`

---

Last updated: 2026-06-17
Maintained by: Design System
Status: Active & Evolving
