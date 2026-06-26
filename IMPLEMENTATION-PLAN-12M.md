# MORIAH CAFÉ — 12-Month Emotional Narrative Transformation Plan
## Complete Implementation Roadmap (Months 1–12)

**Status:** Ready for execution
**Last Updated:** 2026-06-17
**Owner:** Product + Marketing Team

---

## EXECUTIVE SUMMARY

**Mission:** Transform Moriah Café's Shopify Hydrogen storefront from a technical feature showcase into an emotionally-driven narrative experience that positions coffee as generational memory and inherited ritual.

**Core Narrative:** *"Yo no aprendí a querer el café. Lo heredé."* — Generational nostalgia + community co-creation

**Target Outcomes (Month 12):**
- 500–5,000 user-generated stories collected
- Subscription revenue: 35–40% of total ARR
- Retail presence: 300+ stores in Colombia (Éxito, Olímpica)
- Email subscribers: 25,000+ qualified
- Community engagement rate: 8–12% (vs. industry 1–2%)
- Annual "Día del Tinto de Verdad" brand event established

**Investment Scope:**
- **Team:** 1 PM (you) + 1 Content Lead + 1 Email Specialist + 1 Video Editor (6mo) + 1 Copywriter (3mo)
- **Budget:** ~$20K USD (allocation + tools + contractors)
- **Tech Stack:** Hydrogen (existing) + Klaviyo (email) + Zapier (automation) + Shopify Metafields (tracking)

---

## TIMELINE OVERVIEW (12-MONTH GANTT)

```
MONTH   PHASE                   KEY MILESTONES
─────────────────────────────────────────────────────────────
1–3     ACTIVATION              ▓▓▓▓▓▓▓▓▓▓▓▓ Hero rewrite | /memoria form
        Birth of #MiPrimerTinto    Email sequence 1–5 | First 500 stories
        
4–6     CO-CREATION            ▓▓▓▓▓▓▓▓▓▓▓▓ Fanzine auto-gen | Podcast launch
        Community Elevation     Email editorial 6–10 | 2K+ community members
        
7–9     RETAIL EXPANSION       ▓▓▓▓▓▓▓▓▓▓▓▓ Éxito/Olímpica launch | Memory stations
        Physical Activation    Influencer partnerships | Email editorial 11–14
        
10–12   INSTITUTIONALIZATION   ▓▓▓▓▓▓▓▓▓▓▓▓ "Libro de la Memoria" | Annual event
        Legacy Building        Email editorial 15–16 | Year-end campaign
```

---

## PHASE 1: ACTIVATION & MEMORY CAPTURE (Months 1–3)
### "Yo no aprendí a querer el café. Lo heredé."

**Mission:** Launch core narrative, capture first 500+ user stories, establish email channel

### Weekly Sprint Breakdown

#### **WEEK 1: Narrative & Copy Overhaul**
**Lead:** Content/Copy (you)

| Task | File(s) | Change | Priority |
|------|---------|--------|----------|
| 1.1 Rewrite hero copy | `_index.jsx:119–121` | OLD: "Un café para el alma" → NEW: "Yo no aprendí a querer el café. Lo heredé." | 🔴 CRITICAL |
| 1.2 Rewrite hero subheading | `_index.jsx:122–125` | OLD: generic → NEW: Personal memory arc (mother, grandmother, aroma, time) | 🔴 CRITICAL |
| 1.3 Update stats context | `_index.jsx:130–135` | Align with "birth of purpose" not generic numbers | 🟠 HIGH |
| 1.4 Rename "Club Moriah" → "Club de la Memoria" | `_index.jsx:262–306` | Rename + rewrite copy to emphasize community/memory, not discount | 🔴 CRITICAL |
| 1.5 Rewrite "¿Por qué Moriah?" section | `_index.jsx:309–331` | Deepen "monte de la provisión" narrative; add emotional anchor | 🟠 HIGH |
| 1.6 Announcement bar: Launch message | `AnnouncementBar.jsx` | Add: "Bienvenido a #MiPrimerTinto — Cuéntanos tu historia" | 🟠 HIGH |

**Deliverable:** Hero + Club renamed + Announcement live

---

#### **WEEK 2: Coffee Narratives & Memory Form**
**Lead:** Content + Frontend Dev

| Task | File(s) | Scope | Priority |
|------|---------|-------|----------|
| 2.1 Replace 3 coffee placeholder stories | `app/data/cafes.js:story` field | Write real narratives for Bourbon Rosado, Blend Castillo, Geisha (3–4 sentences each, emotive) | 🔴 CRITICAL |
| 2.2 Add producer info (name, photo URL, altitude) | `app/data/cafes.js` | New fields: `producerName`, `producerPhoto`, `producerStory` (100 words) | 🔴 CRITICAL |
| 2.3 Create `/memoria` route | NEW: `app/routes/memoria._index.jsx` | Landing page: hero + form + WhatsApp CTA | 🔴 CRITICAL |
| 2.4 Build MemoryForm component | NEW: `app/components/MemoryForm.jsx` | Form: name + email + story (textarea) + optional voice note upload | 🟠 HIGH |
| 2.5 Add form validation + submission | `MemoryForm.jsx` | Submit → sends email to admin + returns "gracias" page | 🟠 HIGH |
| 2.6 Create `/memoria/gracias` confirmation page | NEW: `app/routes/memoria.gracias.jsx` | Confirmation + 10% code offer | 🟠 HIGH |
| 2.7 Update nav links | `Header.jsx` | Add "Memoria" link to nav (between Cafés + Club) | 🟡 MEDIUM |

**Deliverable:** /memoria form live + coffee narratives updated + producer blocks added to PDP

---

#### **WEEK 3: Email Sequences & Integrations**
**Lead:** Email Specialist + API integrations

| Task | Tool/File | Content | Priority |
|------|-----------|---------|----------|
| 3.1 Set up Klaviyo account | Klaviyo | Connect to Shopify + create list "Moriah Community" | 🔴 CRITICAL |
| 3.2 Create welcome email #1 | Klaviyo email template | Subject: "Yo no aprendí a querer el café. Lo heredé." + founder story (500 words) | 🔴 CRITICAL |
| 3.3 Create welcome email #2 | Klaviyo | Subject: "Bienvenido al Club de la Memoria" + benefits + first memory prompt | 🟠 HIGH |
| 3.4 Create welcome email #3 | Klaviyo | Subject: "Las historias que hemos recibido esta semana" (if available, else soft promo) | 🟠 HIGH |
| 3.5 Create welcome email #4 | Klaviyo | Subject: "¿A qué te recuerda TÚ el olor a café?" (engagement prompt + form link) | 🟠 HIGH |
| 3.6 Create welcome email #5 | Klaviyo | Subject: "Historias de la Tierra: Conoce a [Producer Name]" (dynamic, rotates monthly) | 🟠 HIGH |
| 3.7 Set up Zapier → email on memory submission | Zapier + Klaviyo | When form submitted → add tag "Story Submitted" + email admin | 🟡 MEDIUM |
| 3.8 Link checkout → welcome automation | Shopify + Klaviyo | Post-purchase trigger: send email #1 after 2 hours | 🟡 MEDIUM |

**Deliverable:** Klaviyo account live + 5-email welcome sequence ready + form submission triggers email

---

#### **WEEKS 4–12: Content Creation & Channel Execution**

**Monday–Friday Each Week:**

| Week | Content Creator Task | Channel | Deadline |
|------|---------------------|---------|----------|
| 4 | Script + shoot hero video (60s launch) | IG Reel + TikTok | EOW |
| 5 | Curate first 3 user stories (if available) + design post | IG Carousel | EOW |
| 6 | Reels: "Behind the roast" ASMR | IG Reels + TikTok | EOW |
| 7 | Podcast "La Pausa" Ep. 1 (guest interview) | Spotify/Apple | EOW |
| 8 | Email #6: "Historias de la Costa" (editorial) | Email | EOW |
| 9 | Reels: User story reading (top 1–2) | IG Reels | EOW |
| 10 | Email #7: "Cómo nace un café de especialidad" | Email | EOW |
| 11 | TikTok duet challenge: "A qué te recuerda" | TikTok + IG | EOW |
| 12 | Email #8: "Recuerdos de abril: 3 historias nuevas" | Email | EOW |

**Deliverable:** Weekly content calendar executed; 500+ stories collected; engagement baseline established

---

### Phase 1 Success Metrics (End of Month 3)

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Stories Collected** | 500+ | Form submissions |
| **Email Subscribers** | 3,000+ | Klaviyo list |
| **Subscription CVR** | 2.2%+ | Shopify analytics |
| **Email Open Rate** | 24%+ | Klaviyo reporting |
| **Organic Reach** | 15K–25K impressions/week | IG/TikTok insights |
| **Memory Form Submissions** | 100+ | Form backend |
| **Community Sentiment** | 8/10 | Comment analysis |

---

## PHASE 2: CURATION & CO-CREATION (Months 4–6)
### "Las historias que recibimos son nuestro corazón"

**Mission:** Elevate best user stories to brand content; launch monthly anthology; expand podcast

### Weekly Cadence

#### **WEEK 13–14: Fanzine Automation Setup**
**Lead:** Frontend Dev + Automation Specialist

| Task | Tool | Deliverable | Priority |
|------|------|-------------|----------|
| 2.1 Create "Memorias de la Mesa" template | Figma/Canva | PDF template (8 pages): top 3 stories + illustrations + producer photo | 🔴 CRITICAL |
| 2.2 Set up PDF auto-generation | n8n or Zapier | Trigger: Month ends → query top 3 stories from admin dashboard → generate PDF | 🟠 HIGH |
| 2.3 Build admin dashboard for story curation | NEW: `app/routes/admin/stories.jsx` | Table: all submissions + voting/featured toggle + preview | 🟠 HIGH |
| 2.4 Send fanzine via email to subscribers | Klaviyo | Attach PDF to email #9 (Month 4, Day 1) | 🟡 MEDIUM |

**Deliverable:** First fanzine generated + in subscriber email; admin dashboard live

---

#### **WEEK 15–16: Podcast Launch & Influencer Partnerships**
**Lead:** Content Lead + External Audio Producer

| Task | Scope | Deadline | Priority |
|------|-------|----------|----------|
| 2.5 Podcast Ep. 1 script + guest briefing | "La Pausa" Ep. 1: Founder interview (30 min) | Week 15 | 🔴 CRITICAL |
| 2.6 Record + edit Ep. 1 | Riverside.fm or similar | EOW 16 | 🟠 HIGH |
| 2.7 Upload to Spotify/Apple Podcasts | Anchor or Buzzsprout | EOW 16 | 🟠 HIGH |
| 2.8 Create podcast landing page | NEW: `/podcast` route | Link in footer + email signature | 🟡 MEDIUM |
| 2.9 Identify + brief 3 micro-influencers | Outreach + creative brief | Contract signed | 🟠 HIGH |
| 2.10 Influencer Ep. 2–4 (their coffee memories) | Video partnerships (Reels/TikTok-first) | Weeks 16–22 | 🟠 HIGH |

**Deliverable:** Podcast Ep. 1 live; influencer content calendar locked

---

#### **WEEKS 17–22: Editorial Email Cadence**
**Lead:** Copywriter

Each week, send **weekly editorial email** from founder (non-promotional, cultural storytelling):

| Email # | Subject | Angle | Send Day |
|---------|---------|-------|----------|
| 9 | "Memorias de la Mesa: Abril" | Top 3 April stories + illustrations | 1st of month |
| 10 | "Las manos que cultivan tu café" | Producer spotlight + farm story + impact % | Mid-month |
| 11 | "Método Chemex: Ritual de paciencia" | Educational (how-to) + nostalgia hook | Week 3 |
| 12 | "Recuerdos de mi primer tinto" | Founder vulnerability + community echo | Week 4 |

---

### Phase 2 Success Metrics (End of Month 6)

| KPI | Target | How Measured |
|-----|--------|--------------|
| **Community Members** | 2,000+ | Email list + form responses |
| **Subscription Conversion** | 2.4%+ (up from 2.2%) | Shopify AOV |
| **Fanzine Downloads** | 800+ per issue | Email tracking + bounce |
| **Podcast Downloads** | 1,000+ per episode | Spotify for Artists |
| **User Story UGC Reposted** | 12+ stories featured | Content calendar |
| **Email Engagement** | 26%+ open rate, 4%+ CTR | Klaviyo |
| **Influencer Reach** | 50K+ impressions | IG/TikTok analytics |

---

## PHASE 3: RETAIL EXPANSION & PHYSICAL ACTIVATION (Months 7–9)
### "Moriah en tu supermercado. Una historia en cada estante."

**Mission:** Launch retail in Éxito/Olímpica + sensory activations; scale influencer partnerships

### Key Activities

#### **WEEK 23: Retail Launch Coordination**

| Task | Owner | Deliverable | Priority |
|------|-------|-------------|----------|
| 3.1 Finalize Éxito/Olímpica placement (assumed already negotiated) | Sales/Ops | Shelf facings confirmed + planogram | 🔴 CRITICAL |
| 3.2 Design "Estaciones de la Memoria" retail POS materials | Designer | Printed posters + QR cards + instructions (full-color, on-brand) | 🔴 CRITICAL |
| 3.3 Create retail-specific landing page | Frontend Dev | `/retail` page: "Encuéntranos en 300+ tiendas" + store locator map | 🟠 HIGH |
| 3.4 Update home hero: "Ahora en tiendas seleccionadas" | Frontend | Announce retail expansion prominently | 🟠 HIGH |
| 3.5 Brief retail staff (if applicable) | Ops | Training guide: brand story + how to pitch memory concept | 🟡 MEDIUM |

**Deliverable:** In-store activations live; storefront updated

---

#### **WEEKS 24–30: Sensory & Influencer Content Blitz**

| Week | Activation | Channel | Lead |
|------|------------|---------|------|
| 24 | "Estaciones de la Memoria" microsite (QR registration) | Web | Frontend |
| 25 | Reels series: "En la góndola" (retail shelf + customer reactions) | IG Reels | Content |
| 26 | Podcast Ep. 5: Retail buyer interview | Spotify | Audio Producer |
| 27 | Email #13: "Historias de las tiendas" (early customer feedback) | Klaviyo | Copy |
| 28 | TikTok influencer takeover (3 creators, 1 day each) | TikTok | Content |
| 29 | Podcast Ep. 6: Farmer + roaster conversation | Spotify | Audio Producer |
| 30 | Email #14: "Mensajes desde la comunidad" (3–5 new stories) | Klaviyo | Copy |

---

### Phase 3 Success Metrics (End of Month 9)

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Retail Stores** | 300+ (Éxito + Olímpica) | Sales verification |
| **In-Store Story Registrations** | 400+ | QR/form tracking |
| **Subscription Growth** | +40% vs. Month 3 | Shopify analytics |
| **Email List** | 8,000+ | Klaviyo |
| **Podcast Downloads** | 3,000+ per episode | Spotify |
| **Organic Reach** | 80K+ impressions/week | IG/TikTok |
| **Retail Sell-Through** | 60%+ of monthly allocation | Point of sale data |

---

## PHASE 4: INSTITUTIONALIZATION & LEGACY (Months 10–12)
### "Un año de historias. Un libro. Una promesa."

**Mission:** Consolidate as national brand; publish annual book; establish recurring event

### Key Deliverables

#### **WEEK 31–36: "Libro de la Memoria Cafetera"**

| Task | Scope | Deadline | Priority |
|------|-------|----------|----------|
| 4.1 Curate top 50 stories from year | Editorial panel review | Week 31 | 🔴 CRITICAL |
| 4.2 Hire photographer for farm visits | On-site portraits of producers | Weeks 32–34 | 🔴 CRITICAL |
| 4.3 Design coffee table book layout | Professional designer | Week 34 | 🟠 HIGH |
| 4.4 Print pilot edition (50 copies) | Print house | Week 35 | 🟠 HIGH |
| 4.5 Create downloadable PDF for email | Designer | Week 35 | 🟠 HIGH |
| 4.6 Email announcement + gifting strategy | Marketing | Week 36 | 🟡 MEDIUM |

**Deliverable:** Physical book printed; PDF version launched for community download

---

#### **WEEK 37–39: "Día del Tinto de Verdad" Annual Event**

| Task | Scope | Deadline |
|------|-------|----------|
| 4.7 Define event concept (digital + IRL options) | Marketing | Week 37 |
| 4.8 Create event landing page + registration | Frontend | Week 37 |
| 4.9 Plan social media campaign (2-week push) | Content | Week 38 |
| 4.10 Coordinate local events in 3–5 cities (partner cafés) | Ops | Week 38 |
| 4.11 Design event merchandise (limited edition blend + cup) | Designer/Ops | Week 38 |
| 4.12 Record founder message + retrospective video | Video | Week 39 |
| 4.13 Event day: Live Instagram Stories coverage | Content | Week 40 |

**Deliverable:** Brand annual ritual established; community gathering cemented

---

#### **WEEKS 40–43: Year-End & Future Planning**

| Task | Scope |
|------|-------|
| 4.14 Send final retrospective email + "Estado del Tinto" report | Marketing |
| 4.15 Publish 2025 roadmap + community thank you | Marketing |
| 4.16 Analyze full-year KPIs; plan Year 2 strategy | Leadership |
| 4.17 Solicit community feedback (survey) | Marketing |

---

### Phase 4 Success Metrics (End of Month 12)

| KPI | Target |
|-----|--------|
| **"Libro de la Memoria" Copies Printed** | 500+ |
| **PDF Downloads** | 2,000+ |
| **Annual Event Attendees** | 500+ (digital + IRL combined) |
| **Final Email List** | 15,000–25,000 |
| **Annual Stories Collected** | 2,500–5,000 |
| **Subscription ARR Contribution** | 35–40% of total |
| **Social Following Growth** | +150–200% YoY |
| **Organic Monthly Reach** | 150K+ impressions |
| **Brand Sentiment** | 8.5/10 (community survey) |

---

---

## TECHNICAL REQUIREMENTS INVENTORY

### New Routes to Create

| Route | Component | Purpose | Est. Dev Hours |
|-------|-----------|---------|-----------------|
| `/memoria` | `memoria._index.jsx` | Memory Bank landing + form | 8 |
| `/memoria/gracias` | `memoria.gracias.jsx` | Thank you page + code offer | 2 |
| `/retail` | `retail._index.jsx` | Retail store locator + map | 6 |
| `/podcast` | `podcast._index.jsx` | Podcast feed + episode list | 4 |
| `/admin/stories` | `admin/stories.jsx` | Curation dashboard (password protected) | 12 |
| `/libro` | `libro._index.jsx` | Book landing + download | 3 |
| `/dia-del-tinto` | `dia-del-tinto._index.jsx` | Annual event page | 6 |

**Total Dev Hours: ~41 hours (1 week of full-time dev)**

---

### New Components to Create

| Component | Purpose | Est. Dev Hours |
|-----------|---------|-----------------|
| `MemoryForm.jsx` | Form: name + email + story + optional voice | 6 |
| `StoryCurationDashboard.jsx` | Admin dashboard: submissions + voting + featured | 8 |
| `PodcastFeed.jsx` | Display Spotify embed + episode list | 3 |
| `StoreLocator.jsx` | Map integration (Mapbox or Google Maps) | 6 |
| `BookDownload.jsx` | PDF download button + tracking | 3 |
| `EventCountdown.jsx` | Día del Tinto countdown timer | 2 |

**Total Dev Hours: ~28 hours**

---

### Integrations Required

| Integration | Purpose | Setup Time | Cost/Month |
|-------------|---------|-----------|-----------|
| **Klaviyo** | Email marketing automation | 4 hours | $20–50 (free up to 500 contacts) |
| **Zapier** | Form → email trigger | 2 hours | $20–50 |
| **n8n** | PDF auto-generation + complex workflows | 6 hours | $0 (self-hosted) or $10–100 |
| **Spotify/Apple Podcasts** | Podcast hosting | 2 hours | $0–10/month (via Anchor) |
| **Mapbox** | Store locator map | 1 hour | $0–5/month (free tier) |
| **Shopify Metafields** | Track story data + producer info | 2 hours | $0 |
| **WhatsApp Business API** | Direct messaging | 4 hours | $5/month setup |

**Total Setup Time: ~21 hours**

---

### Modified Files (Existing Codebase)

| File | Lines Changed | Type | Deadline |
|------|---------------|------|----------|
| `_index.jsx` | 119–125 (hero), 260–306 (club), 309–331 (moriah) | Copy | Week 1 |
| `Header.jsx` | Nav links | Component | Week 2 |
| `AnnouncementBar.jsx` | Launch message | Component | Week 1 |
| `app/data/cafes.js` | `story`, `producerName`, `producerPhoto`, `producerStory` | Data | Week 2 |
| `ProductGallery.jsx` | Add producer block section | Component | Week 2 |
| `Footer.jsx` | Add podcast + memoria links | Component | Week 2 |

---

---

## CONTENT INVENTORY & DEADLINES

### Copy & Email Templates (16 Total)

| Email # | Subject | Word Count | Due | Owner |
|---------|---------|-----------|-----|-------|
| 1 | "Yo no aprendí a querer el café. Lo heredé." | 500 | Week 3 | Copywriter |
| 2 | "Bienvenido al Club de la Memoria" | 300 | Week 3 | Copywriter |
| 3 | "Las historias que hemos recibido esta semana" | 200 | Week 3 | Copywriter |
| 4 | "¿A qué te recuerda TÚ el olor a café?" | 250 | Week 3 | Copywriter |
| 5 | "Historias de la Tierra: Conoce a [Producer]" | 350 | Week 3 | Copywriter |
| 6 | "Historias de la Costa" (editorial) | 600 | Week 8 | Copywriter |
| 7 | "Cómo nace un café de especialidad" | 700 | Week 10 | Copywriter |
| 8 | "Recuerdos de abril: 3 historias nuevas" | 400 | Week 12 | Copywriter |
| 9 | "Memorias de la Mesa: Mayo" (fanzine) | 1,200 | Week 17 | Designer |
| 10 | "Las manos que cultivan tu café" | 550 | Week 18 | Copywriter |
| 11 | "Método Chemex: Ritual de paciencia" | 650 | Week 19 | Copywriter |
| 12 | "Recuerdos de mi primer tinto" | 500 | Week 20 | Copywriter |
| 13 | "Historias de las tiendas" | 400 | Week 27 | Copywriter |
| 14 | "Mensajes desde la comunidad" | 350 | Week 30 | Copywriter |
| 15 | "Historias de enero: Retrospectiva" | 800 | Week 43 | Copywriter |
| 16 | "Estado del Tinto: 2025 en números" | 1,000 | Week 43 | Copywriter |

**Total Copy: ~9,500 words**

---

### Video Content (8 Total)

| Video | Format | Length | Due | Owner |
|-------|--------|--------|-----|-------|
| 1 | Launch hero (60s cinematic) | 60s | Week 4 | Video Ed. |
| 2 | ASMR: Coffee roast (IG Reels) | 30s | Week 6 | Video Ed. |
| 3 | User story reading (Reel #1) | 45s | Week 9 | Video Ed. |
| 4 | Shelf stories (Reel #2, retail) | 30s | Week 25 | Video Ed. |
| 5 | Influencer takeover (3 × 60s) | 60s ea. | Week 28 | Influencers |
| 6 | Year-end retrospective | 3–5 min | Week 39 | Video Ed. |
| 7 | Dia del Tinto highlights | 2 min | Week 40 | Video Ed. |
| 8 | 2025 roadmap teaser | 30s | Week 43 | Video Ed. |

**Total Video: 10–12 minutes of content**

---

### Coffee Narratives (3 Stories)

| Coffee | Narrative | Word Count | Due |
|--------|-----------|-----------|-----|
| Bourbon Rosado | Origin story (Finca La Esmeralda, tasting notes, farmer) | 300–400 | Week 2 |
| Blend Castillo Caturra | Process focus (honey fermentation, producer family) | 300–400 | Week 2 |
| Geisha | Premium story (altitude, rarity, tasting experience) | 300–400 | Week 2 |

---

### Podcast Episodes (8 Total)

| Ep. | Title | Guest | Length | Due |
|-----|-------|-------|--------|-----|
| 1 | "El viaje de vuelta" | Founder | 30 min | Week 15 |
| 2 | "Mi primer tinto" | Micro-influencer #1 | 25 min | Week 17 |
| 3 | "La pausa que salvó mi día" | Micro-influencer #2 | 25 min | Week 19 |
| 4 | "Café en familia" | Micro-influencer #3 | 25 min | Week 21 |
| 5 | "Retail, encuentros, historias" | Buyer/curator | 20 min | Week 26 |
| 6 | "De la semilla a tu taza" | Farmer + roaster duo | 30 min | Week 29 |
| 7 | "Un año de memorias" | Community member (guest) | 25 min | Week 39 |
| 8 | "Qué viene en 2026" | Founder + team | 35 min | Week 43 |

---

---

## CHANNEL STRATEGY & PUBLISHING CALENDAR

### Instagram/Reels

**Frequency:** 3–4 posts/week (mix of Reels, Carousels, Stories)

**Content Mix:**
- 40% Emotional narrative (user stories, behind-the-scenes, founder)
- 30% Educational (how-to, tasting, origin education)
- 20% Community (UGC, user stories, testimonials)
- 10% Promotional (offers, launches, events)

**Post Types:**
- **Reels (2/week):** 30–60 seconds, trending audio or custom VO (ASMR, story reading)
- **Carousel (1/week):** 5–7 slides, depth storytelling (producer story, process, history)
- **Stories (Daily):** Behind-the-scenes, polls, memory prompts, announcements
- **Igtv/Long-form (1/month):** Podcast teaser, event coverage, founder reflection

**Posting Schedule:**
- Reels: Tuesday 9 AM + Friday 6 PM CT
- Carousel: Wednesday 10 AM CT
- Stories: Variable (morning + evening)

---

### TikTok

**Frequency:** 1–2 videos/week

**Content Mix:**
- 50% Native storytelling (less produced, raw emotion)
- 30% Trends + Challenges (duets, stitches, sounds)
- 20% Behind-the-scenes, bloopers, team culture

**Post Schedule:**
- Monday 7 PM CT
- Thursday 9 AM CT

**Strategy:** Let TikTok algorithm work; prioritize authenticity over polish

---

### Email

**Frequency:** 1–2 per week

**Types:**
- **Welcome sequence (5 emails):** Weeks 1–3
- **Weekly editorial (12 emails):** Alternating storytelling + educational
- **Monthly fanzine (3 PDFs):** Months 4–6
- **Promotional (4 emails):** New launches, sales events
- **Event-based (5 emails):** Retail launch, Dia del Tinto

**KPI Targets:**
- Open rate: 24%+
- Click-through: 4%+
- Unsubscribe: <0.5%

---

### WhatsApp Business

**Frequency:** Status updates (daily–3x per week) + 24h support

**Use Cases:**
- Daily morning ritual prompt
- Memory submission link (pinned)
- New blog/podcast announcement
- Catalog updates (monthly)
- Customer support (24h response)

---

### LinkedIn

**Frequency:** 1–2 posts/week

**Audience:** B2B (retailers, corporate gifting, agencies)

**Content:**
- Specialty coffee market insights
- Social impact (producer stories, fair trade)
- Brand building (founder reflections on building for emotion vs. commodity)
- Retail partnership updates

---

### Podcast ("La Pausa")

**Frequency:** Bi-weekly (14 episodes/year, months 4–12)

**Distribution:** Spotify, Apple Podcasts, Amazon Music

**Episode Structure:**
- Intro (host) + guest intro (2 min)
- Main conversation (20–30 min)
- Outro + call-to-action (3–5 min)

---

---

## KPI DASHBOARD & SUCCESS METRICS

### Overall North Star Metrics

| Metric | Month 3 | Month 6 | Month 9 | Month 12 | Target |
|--------|---------|---------|---------|----------|--------|
| **User Stories Collected** | 500 | 1,500 | 3,000 | 5,000 | 5K+ |
| **Email Subscribers** | 3,000 | 8,000 | 12,000 | 25,000 | 25K+ |
| **Subscription LTV** | $180 | $240 | $300 | $350 | +100% from Month 1 |
| **Community Engagement Rate** | 6% | 8% | 10% | 12% | 12%+ |
| **Organic Reach (monthly)** | 50K | 150K | 300K | 600K+ | 600K+ impressions |
| **Email Open Rate** | 24% | 26% | 27% | 28% | 28%+ |
| **Subscription CVR** | 2.2% | 2.4% | 2.7% | 3.0% | 3%+ |

---

### Phase-Specific Metrics

#### **Phase 1 (End Month 3)**
- Stories collected: 500+
- Email list: 3,000+
- IG followers: 1,500–2,000
- TikTok followers: 500–800
- Website traffic: 8,000–10,000 monthly
- Memory form submissions: 100+

#### **Phase 2 (End Month 6)**
- Stories collected: 1,500+
- Email list: 8,000+
- Podcast downloads: 1,000+/episode
- Fanzines downloaded: 800+
- Influencer reach: 50K+ impressions
- Subscription churn: <20% monthly

#### **Phase 3 (End Month 9)**
- Retail stores: 300+
- In-store registrations: 400+
- Email list: 12,000+
- Subscription +40% growth
- Podcast: 3,000+/episode
- Organic reach: 300K+ monthly

#### **Phase 4 (End Month 12)**
- Stories collected: 5,000+
- Email list: 25,000+
- Book copies printed: 500+
- Annual event attendees: 500+
- Subscription ARR: 35–40% of total
- Community sentiment: 8.5/10

---

---

## RISK & DEPENDENCY MATRIX

### Critical Dependencies

| Dependency | Phase | Risk Level | Mitigation |
|------------|-------|-----------|-----------|
| **Email platform (Klaviyo) setup** | 1 | CRITICAL | Week 3 deadline; use default templates if delayed |
| **Coffee narrative content** | 1 | CRITICAL | Hire copywriter immediately; use 3 existing producer stories as fallback |
| **Memory form development** | 1 | HIGH | MVP: basic text form only; voice upload in Phase 2 |
| **Video production (60s hero)** | 1 | HIGH | DIY with iPhone + CapCut if external editor unavailable |
| **Retail negotiation (Éxito/Olímpica)** | 3 | CRITICAL | Assume already finalized; if not, delay Phase 3 start |
| **Podcast production setup** | 2 | HIGH | Use Anchor (free) instead of paid studio if budget tight |
| **PDF fanzine automation (n8n)** | 2 | HIGH | Manual PDF creation + email in Month 4 if automation fails |
| **Book designer & photographer** | 4 | MEDIUM | Pre-contract in Month 8; allow 4-week production window |

---

### Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Low story submission rate (<100/month)** | Phase 1 fails | MEDIUM | Aggressive seeding (founder + team submitting first 10 stories) + incentive prizes |
| **Email list growth stalls** | Revenue at risk | MEDIUM | Retargeting ads (IG/Google) + in-store signups (QR codes) in Phase 3 |
| **Video production delays** | Content calendar misses | LOW | Pre-produce Month 1 content in Weeks 1–2 |
| **Retail launch slips** | Phase 3 compressed | MEDIUM | Plan Phase 2–3 overlap; retail activation can start in Month 8 vs. 7 |
| **Team burnout (content overload)** | Quality drops | MEDIUM | Hire freelance copywriter + video editor; batch-create content |
| **Community backlash (inauthentic content)** | Brand trust eroded | LOW | Strict UGC approval process; feature real stories, not manufactured ones |
| **Email deliverability issues (spam filters)** | Low engagement | LOW | Warmup sends; authenticate domain (SPF/DKIM); monitor blacklist status |
| **Podcast downloads plateau** | Low engagement | MEDIUM | Cross-promote in email + social; guest stars in Months 5–7 |

---

---

## RESOURCE ALLOCATION

### Team Structure (12 months)

**Full-Time (You):**
- **Product Manager (Mateo):** Oversight, sprint planning, stakeholder alignment, strategic decisions
- **40 hours/week**

**Part-Time/Contract:**
1. **Content Lead** (part-time, 20 hrs/week)
   - Copy editing, social calendar, community management
   - Cost: $1,500–2,000/month

2. **Email Specialist** (part-time, 15 hrs/week, Months 1–6, then 10 hrs/week 7–12)
   - Klaviyo setup, sequence design, automation testing
   - Cost: $1,200–1,500/month

3. **Video Editor** (freelance, 10 hrs/week, Months 1–6)
   - Edit Reels, TikTok, hero video, podcast teasers
   - Cost: $1,000–1,500/month

4. **Copywriter** (freelance, 20 hrs/week, Months 1–3, 7–9)
   - Email templates, coffee narratives, social copy, fanzine copy
   - Cost: $1,500–2,000/month

5. **Frontend Developer** (freelance/contractor, 40 hrs/week, Months 1–2)
   - Routes, components, integrations, admin dashboard
   - Cost: $3,000–4,000/month (2 months = $6–8K total)

6. **Audio Producer** (freelance, 8 hrs/week, Months 4–12)
   - Podcast recording, editing, distribution
   - Cost: $600–900/month

**Design:**
- Figma template for fanzine (internal or $200 one-time)
- Book design (external, $1,500–2,500, Month 10)
- Event collateral (internal + $300 print)

---

### Budget Breakdown (12 Months)

| Category | Cost | Notes |
|----------|------|-------|
| **Payroll (contractors)** | $22,000 | Content Lead + Email + Video (6mo) + Copy (6mo) + Audio (9mo) |
| **Dev/Frontend (contractor)** | $7,000 | 2 months full-time |
| **Email Platform (Klaviyo)** | $400 | $25–50/month × 12 |
| **Automation Tools (n8n, Zapier)** | $200 | $15–30/month × 12 |
| **Podcast Hosting (Anchor/Buzzsprout)** | $120 | $10/month × 12 |
| **Design & Illustration** | $2,000 | Fanzine template + book design + event collateral |
| **Print & Production** | $3,000 | Book printing (500 copies @ $5–6 ea) + fanzine (monthly, 1000 copies) |
| **Audio Production** | $500 | Recording/editing software licenses |
| **Ads & Promotion** | $2,000 | Retargeting campaigns (Months 6–9) |
| **Miscellaneous** | $500 | Contingency, tools, subscriptions |
| **TOTAL** | ~$37,720 | |

**Note:** Does not include your salary (PM) or existing Hydrogen infrastructure costs.

---

---

## WEEKLY SPRINT CHECKLIST

Use this as your operating template. Copy & adapt per sprint.

### Sprint Template (Every Monday)

```
SPRINT WEEK [X] (Months [Y])
Owner: [Name]
Focus: [Core objective]

CRITICAL (🔴) — Must ship this week:
- [ ] Task A (Owner: X | ETA: Wed)
- [ ] Task B (Owner: Y | ETA: Fri)

HIGH (🟠) — Should ship this week:
- [ ] Task C (Owner: Z | ETA: Thu)

MEDIUM (🟡) — Nice to have:
- [ ] Task D (Owner: X | ETA: Fri)

BLOCKERS:
- [If any dependency is at risk, list it]

METRICS TO TRACK:
- Email open rate (target: 24%+)
- Social engagement (target: 5%+ reach)
- Form submissions (target: 20+/week)

NEXT WEEK PREP:
- [What needs to be ready for Week X+1?]
```

---

---

## IMMEDIATE NEXT STEPS (WEEK 1)

### This Week (Monday–Friday)

**Monday:**
- [ ] Schedule kickoff meeting: you + Content Lead + Email Specialist + Dev
- [ ] Review this plan; assign owners
- [ ] Create shared project board (Linear, Asana, or GitHub Projects)

**Tuesday:**
- [ ] Draft new hero copy ("Yo no aprendí...") — 2 hour session with copywriter
- [ ] Write coffee narratives (Bourbon, Blend, Geisha) — 3 hours
- [ ] Approve designs for announcement bar + Memory form wireframe

**Wednesday:**
- [ ] Review + finalize hero copy; pass to dev
- [ ] Meet with Email Specialist: design Klaviyo account structure + welcome sequence outlines
- [ ] Contract video editor; brief on hero video shoot

**Thursday:**
- [ ] Review Memory form component with dev; finalize spec
- [ ] Shoot hero video (internal team, iPhone + CapCut is fine for first cut)
- [ ] Create content calendar (IG, TikTok, Email) for Months 1–3

**Friday:**
- [ ] Review all Week 1 deliverables (copy, video, form wireframe, calendar)
- [ ] Prepare social post: #MiPrimerTinto launch announcement
- [ ] Plan Week 2 priorities

---

### By End of Week 2

- [ ] Hero copy approved + deployed
- [ ] Memory form MVP coded + staging
- [ ] Coffee narratives finalized
- [ ] Klaviyo account active + welcome sequence drafted
- [ ] Hero video edit v1
- [ ] Content calendar locked for Months 1–3
- [ ] Copywriter + Video Editor contracted

---

### By End of Week 3 (Phase 1 Launch Day)

- [ ] Hero live in production
- [ ] Memory form live (/memoria route)
- [ ] Email sequences deployed (5-email welcome automation)
- [ ] First social posts scheduled (IG Reel + TikTok)
- [ ] Announcement bar live
- [ ] Coffee narratives + producer blocks live on PDP

---

---

## SUCCESS CRITERIA (Month 12 Retrospective)

At the end of this 12-month plan, you should be able to answer YES to:

**Narrative & Emotional**
- [ ] Did the brand shift from "coffee commodity" to "coffee as inherited memory"?
- [ ] Do customers feel like they're part of a community, not just a customer list?
- [ ] Is the founder's personal story the primary differentiator?

**Growth**
- [ ] Did you collect 5,000+ user stories?
- [ ] Did email list grow to 25,000+?
- [ ] Did subscription ARR contribution reach 35–40%?

**Content & Community**
- [ ] Did you produce 52 weekly social posts + 16 emails + 8 podcast episodes + 1 book?
- [ ] Are user-generated stories the primary content lever (not paid ads)?
- [ ] Is the podcast reaching 3,000+/episode by Month 12?

**Retail & Distribution**
- [ ] Did you launch in 300+ retail stores?
- [ ] Are in-store memory stations generating foot traffic + registrations?
- [ ] Is retail representing 20%+ of revenue by Month 12?

**Legacy & Defensibility**
- [ ] Did you establish an annual "Día del Tinto de Verdad" event?
- [ ] Is the annual "Libro de la Memoria" becoming a tradition?
- [ ] Does the brand have a 12-month moat (community stories competitors can't replicate)?

---

---

## APPENDICES

### Appendix A: Copy Templates (Placeholder Outlines)

#### Email #1 Subject: "Yo no aprendí a querer el café. Lo heredé."

```
Hola [Name],

Hace poco recordé algo que no había pensado en años. 

Cuando era niño, no entendía por qué ese olor me detenía. Salía de la cocina, 
llenaba la casa entera... y de repente, todos aparecían.

Mi abuela, mis tíos, mi mamá.

El tinto no era la excusa para reunirnos. Era la señal.

Crecí. Y un día me di cuenta de que estaba perdiendo algo que no sabía cómo 
nombrar. No era una casa, ni un pueblo. Era ese olor exacto.

Por eso nací Moriah.

No es solo un café de especialidad. Es un tributo a la pausa, al color y 
a la abundancia de esas mañanas que le devuelven a la vida lo que de verdad importa.

Te doy la bienvenida al Club de la Memoria.

[Button: "Descubre nuestros cafés"]

Con cariño,
[Founder Name]
Moriah Café

P.S. ¿A qué te recuerda a ti el olor a café? Comparte tu historia en los comentarios.
```

---

### Appendix B: Admin Dashboard Mockup (Figma/Wireframe)

```
┌─────────────────────────────────────────────────────┐
│ MORIAH ADMIN — CURATION DASHBOARD                   │
├─────────────────────────────────────────────────────┤
│ Stories | Settings | Analytics                      │
│                                                     │
│ FILTERS: [Month: June] [Status: Pending] [Vote: —] │
│                                                     │
│ STORIES (12 total)                                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ★★★★★ Laura M. · Bogotá                         │ │
│ │ "Café con mi abuelo antes de que se fuera..."   │ │
│ │ Submitted: 2 days ago | Views: 145             │ │
│ │ [ ] Feature (Month 7 Fanzine)                   │ │
│ │ [×] Decline | [✓] Approve                       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ★★★★☆ Andrés R. · Medellín                      │ │
│ │ "Mi novia y yo compartimos el primer tinto..."  │ │
│ │ Submitted: 1 day ago | Views: 89               │ │
│ │ [ ] Feature                                     │ │
│ │ [×] Decline | [✓] Approve                       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Appendix C: Email Calendar Template

| Week | Email # | Subject | Segment | Send Time |
|------|---------|---------|---------|-----------|
| 1 | 1 | Welcome: "Heredé" | All new | +2 hours post-purchase |
| 2 | 2 | Club de la Memoria | All new | +24 hours |
| 3 | 3 | Stories received | All | Tuesday 10 AM |
| 4 | 4 | What's YOUR story? | All | Friday 6 PM |
| 5 | 5 | Producer spotlight | Subscribers | Wednesday 10 AM |
| 8 | 6 | Editorial: Costa stories | All | Thursday 7 AM |
| 10 | 7 | How-to: Chemex ritual | All | Tuesday 10 AM |
| 12 | 8 | Founder reflection | All | Friday 6 PM |

---

### Appendix D: Social Content Calendar (Months 1–3 Sample)

**Month 1 (Activation Launch)**

| Week | Platform | Type | Topic | Posting Day | Est. Reach |
|------|----------|------|-------|-------------|-----------|
| 1 | IG Reel | Launch video (60s) | "Heredé" hook | Tue 9 AM | 2K–3K |
| 1 | TikTok | Same video | Launch | Tue 8 PM | 1K–2K |
| 1 | IG Story | Teaser | #MiPrimerTinto CTA | Daily | Reach: 500–1K |
| 2 | IG Carousel | Educational | "Cómo probamos café" | Wed 10 AM | 1.5K–2K |
| 2 | IG Reel | ASMR | Coffee grind | Fri 6 PM | 2K–3K |
| 2 | TikTok | Trend sound | Coffee moment | Thu 9 AM | 1K–1.5K |
| 3 | IG Carousel | User story #1 | Laura's story (if available) | Wed 10 AM | 1.5K–2K |
| 3 | IG Reel | Founder VO | Memory moment | Fri 6 PM | 2K–3K |
| 3 | TikTok | Duet challenge | "Tag yourself" | Tue 8 PM | 1.5K–2K |
| 4 | IG Story | Poll | Which cafe next? | Daily | Engagement: 5–8% |
| 4 | Email | Welcome #1 | Heredé narrative | Mon 10 AM | Open: 20%+ |

---

This is your complete 12-month playbook. Print it. Share with your team. Use the weekly checklists every Monday. Adjust based on early learnings, but stay true to the narrative arc.

**You've got this. Let's build a brand that millions inherit.**

---

*Plan created: 2026-06-17*
*Version: 1.0 (Ready for execution)*
