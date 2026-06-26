# MORIAH — WEEK 1 EXECUTION TASKS
## Ready to Start Monday Morning

**Plan Reference:** `IMPLEMENTATION-PLAN-12M.md` (full 12M strategy)
**Timeline:** Week 1 (June 17–21, 2026)
**Sprint Owner:** Mateo (PM)

---

## 🎯 Sprint Objective

Transform hero narrative from generic ("Un café para el alma") to emotionally-specific ("Yo no aprendí a querer el café. Lo heredé.") while setting up email infrastructure and Memory form development.

**Expected Outcomes:**
- New hero copy written + approved
- Coffee narratives completed (3 real stories)
- Klaviyo account created + email sequences drafted
- Memory form specs finalized
- Content calendar locked for Months 1–3
- Hero video scheduled for filming

---

## MONDAY, JUNE 17

### Morning (9:00 AM)

**TASK 1.1: Kickoff Meeting Setup** (You)
- [ ] Schedule 1-hour meeting with: Content Lead + Email Specialist + Frontend Dev
- [ ] Send agenda 24h before:
  - Overview of 12M plan
  - Assign Week 1 owners
  - Clarify blockers
  - Confirm budget/resources
- **Deadline:** 10:00 AM (send calendar invite by EOD Friday 16th)

**TASK 1.2: Project Board Setup** (You)
- [ ] Choose tool: Linear, Asana, or GitHub Projects
- [ ] Create board with columns: Backlog | In Progress | Review | Done
- [ ] Create cards for all Week 1 tasks
- [ ] Share access with team
- **Tool Link:** [Paste your board URL here when ready]

### Afternoon (2:00 PM)

**TASK 1.3: Review Complete Plan** (You — Solo, 90 min)
- [ ] Read `IMPLEMENTATION-PLAN-12M.md` front-to-back
- [ ] Highlight 3 biggest risks/questions
- [ ] Make notes on what's unclear or needs adjustment
- [ ] Prepare 5-min summary for kickoff meeting
- **Deliverable:** Notes + Q&A list for team

---

## TUESDAY, JUNE 18

### Morning (9:00 AM)

**TASK 2.1: Hero Copy Writing Session** (Content Lead + You)
- **Owner:** Copywriter (or You if copywriter not yet hired)
- **Duration:** 2 hours
- [ ] Review current hero section (`_index.jsx:119–125`)
- [ ] Draft 3 variations of new hero copy (starting with "Yo no aprendí...")
  - Variation A: Short, punchy (50 words)
  - Variation B: Medium, personal (80 words)
  - Variation C: Long, narrative (120 words)
- [ ] Select best variation
- [ ] Draft subheading (supporting memory narrative, 2–3 sentences)
- **Output:** 
  ```
  HERO COPY (Final):
  Headline: [Copy here]
  Subheading: [Copy here]
  ```

**TASK 2.2: Coffee Narratives Writing** (Copywriter)
- **Owner:** Copywriter (freelance if possible; else you)
- **Duration:** 3–4 hours
- [ ] Write 3 coffee origin stories (300–400 words each):
  - **Bourbon Rosado:** Focus on Finca La Esmeralda, farmer family, tasting journey
  - **Blend Castillo Caturra:** Focus on honey fermentation process, regional terroir
  - **Geisha:** Focus on rarity, altitude, premium experience, expectation-breaking moment
- **Tone:** Personal, sensory, credible (not generic marketing)
- **Examples to avoid:** "Smooth blend with notes of chocolate and fruit"
- **Examples to emulate:** "When you first open the bag, the aroma stops you. It's not just coffee smell—it's the smell of mornings when time moved slower."
- **Output:** 
  ```markdown
  # CAFÉ NARRATIVES — APPROVED
  
  ## Bourbon Rosado
  [Story text here]
  
  ## Blend Castillo Caturra
  [Story text here]
  
  ## Geisha
  [Story text here]
  ```

### Afternoon (2:00 PM)

**TASK 2.3: Coffee Narrative Review** (You)
- [ ] Read 3 narratives (30 min)
- [ ] Approve or request revisions (if revisions needed, turnaround is Wed morning)
- [ ] Add to `app/data/cafes.js` field `story` (ready for Dev on Wed)

**TASK 2.4: Email Specialist Kickoff** (Email Specialist + You)
- **Duration:** 1 hour
- [ ] Explain campaign: #MiPrimerTinto, Club de la Memoria, community co-creation
- [ ] Show Klaviyo dashboard (or set up together if first time)
- [ ] Outline 5-email welcome sequence (general structure; copy comes next week)
  1. Welcome + founder story ("Heredé")
  2. Club de la Memoria benefits
  3. "Stories we received this week"
  4. User story prompt + Memory form link
  5. Producer spotlight (dynamic, rotates monthly)
- [ ] Assign: Email Spec draws wireframes of each email template by EOD Wed
- **Deliverable:** Email structure + template outline (text + image placeholders)

---

## WEDNESDAY, JUNE 19

### Morning (9:00 AM)

**TASK 3.1: Review & Finalize Hero Copy** (You + Content Lead)
- [ ] Final review of 3 copy variations
- [ ] Select winning headline + subheading
- [ ] Pass to Dev for integration
- **Output:** Approved copy ready for `_index.jsx` lines 119–125

**TASK 3.2: Form Spec & Design** (Frontend Dev + You)
- **Duration:** 1.5 hours
- [ ] Review Memory form requirements:
  - Fields: Name, Email, Story (textarea), Optional voice upload
  - Button: "Compartir mi historia"
  - Success state: Redirect to `/memoria/gracias` with 10% code
- [ ] Wireframe in Figma (simple: form container + inputs + button)
- [ ] Estimate dev time (should be 6–8 hours)
- [ ] Approve spec; Dev starts build Wed afternoon
- **Output:** Approved wireframe + component spec

**TASK 3.3: Announcement Bar Copy** (Content Lead or You)
- [ ] Write short announcement: "Bienvenido a #MiPrimerTinto — Cuéntanos tu historia" (30 chars max)
- [ ] Alternative: "Comparte tu primer tinto. Únete a la memoria." (50 chars)
- [ ] Decide on: background color (green pino or gold), text color (cream), link (to /memoria)
- **Output:** Finalized copy + design spec for `AnnouncementBar.jsx`

### Afternoon (2:00 PM)

**TASK 3.4: Content Calendar Lock** (Content Lead + You)
- **Duration:** 2 hours
- [ ] Create master calendar: IG, TikTok, Email (Months 1–3)
  - IG: 3–4 posts/week (Reels, Carousels, Stories)
  - TikTok: 1–2 videos/week
  - Email: 1–2/week (welcome sequence + promotional)
- [ ] Decide:
  - Which days/times to post (e.g., IG Tue 9 AM, Fri 6 PM)
  - Content themes by week (e.g., Week 1: launch, Week 2: educational, Week 3: first user story)
  - Hero video shot date (propose: Thu/Fri this week)
- **Output:** Spreadsheet or Airtable with full calendar (sample rows: Platform | Date | Post Type | Topic | Owner | Status)

**TASK 3.5: Video Production Brief** (You)
- [ ] Contact video editor:
  - Confirm availability for Week 1–2
  - Brief: 60-second hero launch video ("Yo no aprendí..." narrative + family moments + Moriah coffee reveal)
  - Tone: cinematic, nostalgic, premium, deeply Caribbean
  - Provide reference videos (e.g., similar brands' hero videos; Pergamino, BUNA, Juan Valdez)
  - Propose shoot date: Thu June 19 or Fri June 20 (at home, 2–3 hours)
- [ ] Confirm: Budget, turnaround (edit deadline: Sun June 22)
- **Output:** Editor confirmed + shoot date locked

---

## THURSDAY, JUNE 20

### All Day: Flexible Based on Availability

**TASK 4.1: Hero Video Shoot** (You + Content Lead + Video Editor)
- **Duration:** 2–3 hours
- [ ] Location: Your home or office (nostalgic setting preferred)
- [ ] Props: Coffee cup, coffee maker, family photos (optional)
- [ ] Shots to capture (shot list from Video Editor):
  - Steaming cup (macro close-up) — 5–10 takes
  - Hands holding cup (warm, worn hands) — 3–5 takes
  - Light through window (golden hour, morning) — 5 takes
  - Family moment (or yourself reflecting) — 3–5 takes
  - Coffee bag (Moriah product shot) — 3 takes
  - Logo reveal/final frame — 2 takes
- [ ] Shoot raw video (not edited; editor does post-production)
- **Output:** Raw footage files → Video Editor inbox

**TASK 4.2: Developer Sprint** (Frontend Dev)
- [ ] Integrate new hero copy into `_index.jsx:119–125`
- [ ] Start Memory form component build (target: MVP code by Fri)
- [ ] Create `/memoria` route skeleton
- [ ] Update nav links in `Header.jsx` (add "Memoria" link)
- **Output:** PR ready for review by Fri

**TASK 4.3: Email Specialist Work** (Email Specialist)
- [ ] Set up Klaviyo account (if not already done):
  - Connect to Shopify store
  - Create list "Moriah Community"
  - Enable Shopify data sync (contacts, purchase history)
- [ ] Create welcome email templates (5 templates, text-only, no design yet):
  - Email 1: "Heredé" founder story
  - Email 2: Club de la Memoria benefits
  - Email 3: "Stories received"
  - Email 4: "What's YOUR story?"
  - Email 5: "Producer spotlight" (template with dynamic fields)
- [ ] Test email send (send test to yourself from Klaviyo)
- **Output:** 5 email templates in Klaviyo (approval needed Fri morning)

---

## FRIDAY, JUNE 21

### Morning (9:00 AM)

**TASK 5.1: Coffee Narratives Final Review** (You)
- [ ] Re-read all 3 narratives
- [ ] Check for tone consistency, sensory details, credibility
- [ ] Approve for integration OR request revisions
- [ ] If approved: Send to Dev for `app/data/cafes.js` integration
- **Output:** Signed-off narratives in dev queue

**TASK 5.2: Producer Block Design** (Content Lead + Designer)
- [ ] Add producer info to PDP mockup:
  - Producer name (e.g., "Doña Elena")
  - Photo (URL or placeholder)
  - Quote or short story (50 words)
  - Altitude (e.g., "1,800 msnm")
- [ ] Design as visual block (photo + text + italics for quote)
- [ ] Component spec for Dev: `ProducerBlock.jsx`
- **Output:** Approved design + code specs

**TASK 5.3: Email Sequence Approval** (You)
- **Duration:** 1 hour
- [ ] Review 5 email templates from Email Specialist
- [ ] Approve or request revisions
- [ ] Decision: Do we deploy emails Fri or wait for Mon?
  - If Mon, Email Spec needs extra time for design
  - If Fri, bare-bones text emails go live (design added next week)
- **Output:** Decision + approval/revision list

**TASK 5.4: Week 1 Retrospective & Week 2 Prep** (You)
- [ ] Update project board: Mark all Week 1 tasks complete/blocked
- [ ] Identify blockers: Did anything slip? Why?
- [ ] Prepare Week 2 priorities:
  - Memory form complete & test
  - Email sequences deploy
  - Social calendar posts scheduled
  - Copywriter hired (if not already)
- [ ] Schedule Week 2 kickoff call (Mon 9 AM)
- **Output:** Week 2 task list + priorities

### Afternoon (2:00 PM)

**TASK 5.5: Content Calendar Execution** (Content Lead)
- [ ] Schedule all Mon–Fri posts in IG/TikTok schedulers (Monday's posts)
- [ ] Write captions + hashtags (#MiPrimerTinto, #MoriahCafe, etc.)
- [ ] Prepare assets (video, images, copy)
- **Output:** Mon posts scheduled + ready to publish Tue 9 AM

**TASK 5.6: Video Editor Delivery** (Video Editor)
- [ ] Submit hero video edit v1 (60 seconds, rough cut)
- [ ] You & Content Lead review Sun evening (give notes for revisions)
- [ ] Final edit deadline: Mon June 24
- **Output:** Hero video ready for Mon social publish

---

## BY END OF WEEK 1 (Friday EOD)

### DELIVERABLES CHECKLIST

**🟢 Copy & Narrative:**
- [ ] Hero copy finalized (headline + subheading)
- [ ] 3 coffee narratives (Bourbon, Blend, Geisha)
- [ ] Announcement bar copy approved
- [ ] Email subject lines drafted

**🟢 Development:**
- [ ] `/memoria` route skeleton created
- [ ] Memory form component code started
- [ ] Hero copy deployed to `_index.jsx`
- [ ] Nav updated with "Memoria" link

**🟢 Email/Automation:**
- [ ] Klaviyo account set up + Shopify synced
- [ ] 5 welcome email templates created (text-only)
- [ ] Email deployment plan finalized (go-live date)

**🟢 Content/Social:**
- [ ] Content calendar locked (Months 1–3)
- [ ] Hero video shot + edit in progress
- [ ] Mon–Fri posts scheduled (first week)
- [ ] Social hashtag list finalized

**🟢 Admin/Ops:**
- [ ] Project board populated with Week 1 tasks (all marked complete or in review)
- [ ] Copywriter hired (if external)
- [ ] Video editor contracted + delivery confirmed
- [ ] Team sync completed (no major blockers)

---

## 🎬 WEEK 1 SUCCESS CRITERIA

By Friday June 21, you should be able to say:

✅ "The hero narrative is fundamentally different—more personal, more nostalgic—and the whole team understands the emotional direction."

✅ "We have written, specific coffee stories that feel like they're from real people, not generic marketing."

✅ "Email infrastructure is ready to deploy; first customer emails go out Mon June 24."

✅ "Memory form specs are finalized; dev can build it in 6–8 hours (Tue–Wed)."

✅ "We have a content calendar that prevents bottlenecks and ensures consistent posting."

✅ "Video production is in flight; hero video is 48h from done."

---

## BLOCKERS & HOW TO UNBLOCK

| Blocker | Impact | Resolution |
|---------|--------|-----------|
| **Copywriter not available Tue** | Coffee narratives delayed | YOU write them (templates provided in IMPL-PLAN) + hire freelancer ASAP |
| **Video editor cancels** | Hero video slips to Week 2 | DIY with iPhone + CapCut; ask Content Lead to shoot |
| **Klaviyo onboarding complex** | Email delayed | Schedule 30-min support call with Klaviyo; Email Specialist leads |
| **Dev blocked by design** | Form build delayed | Use wireframe from Wed design session; full design polish in Week 2 |
| **Scopecreep (stakeholder requests)** | Week slips | Defer to Week 2–3; document as backlog; revisit in sprint planning |

---

## CONTACTS & RESOURCES

| Role | Name | Email | Phone | Slack |
|------|------|-------|-------|-------|
| PM | Mateo | mateo@moriah.cafe | — | @mateo |
| Content Lead | [Your hire] | — | — | — |
| Email Specialist | [Your hire] | — | — | — |
| Frontend Dev | [Your hire] | — | — | — |
| Video Editor | [Your hire] | — | — | — |
| Copywriter | [Your hire] | — | — | — |

**Tools:**
- Project board: [URL]
- Figma: [URL]
- Klaviyo: [URL]
- Shopify: [URL]
- GitHub/Repo: [URL]

---

## NEXT STEPS (If Blocking Today)

**If you start today (Tue 17th instead of Mon 18th):**
- Consolidate Tasks 1.1 + 2.1 (hero copy session same day, 9 AM)
- Run Tasks 1.2 + 1.3 in parallel (you + team member)
- Everything else on schedule

**If you have team available now:**
- Start Task 3.1 (hero copy review) today
- Keep Tasks 2.2 (narratives) on track for Tue
- Move Task 4.1 (video shoot) to Thu or Fri

**If external contractors not hired yet:**
- This is CRITICAL blocker
- Budget request: Copywriter ($500–800 for Week 1 work), Video Editor ($300–500), Email Specialist ($400–600)
- Hire today to avoid Week 1 slip

---

**You're ready to start Monday. Let's ship this.**

*Last updated: 2026-06-17*
