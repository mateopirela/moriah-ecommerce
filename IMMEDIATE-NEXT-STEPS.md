# ⚡ IMMEDIATE NEXT STEPS — Action Plan (Now → 48 Hours)

**You just received a complete Phase 1A implementation (narrative + forms + emails + infrastructure).**

Below is what you need to do RIGHT NOW to go live. Estimated time: **4–6 hours total** (most is setup, not code).

---

## BEFORE YOU DO ANYTHING ELSE

1. **Read this file** (5 min)
2. **Review `PHASE-1A-EXECUTION-SUMMARY.md`** (10 min) — understand what was built
3. **Open `NARRATIVE-TRANSFORMATION-EXECUTED.md`** (keep it open for reference)
4. **Complete the checklist below**

---

## TASK 1: VERIFY LOCAL BUILD (30 MIN)

Your code is ready, but verify it compiles:

```bash
cd storefront

# Step 1: Install deps (including zod)
npm install

# Step 2: Run dev server
npm run dev

# Step 3: Visit http://localhost:3000 and check:
```

**Verification checklist:**
- [ ] Dev server boots without errors
- [ ] Homepage hero says "Yo no aprendí a querer el café. Lo heredé."
- [ ] Nav shows "Comparte tu historia" link
- [ ] Click nav link → `/memoria` page loads
- [ ] Click a coffee → PDP shows producer name + story
- [ ] Form validation works (try submitting empty; should show errors)
- [ ] Submit valid form → redirect to `/memoria/gracias` with code
- [ ] No console errors

**If something breaks:** Check `NARRATIVE-TRANSFORMATION-EXECUTED.md` troubleshooting section.

---

## TASK 2: CREATE KLAVIYO ACCOUNT (15 MIN)

Go to **https://www.klaviyo.com** and sign up (free):

1. **Sign up** with your email
2. **Create new organization** (name: "MORIAH Café")
3. **Create a list** called "Moriah Community"
4. **Go to Account Settings → API Keys**
   - Generate new "Private API Key"
   - Copy the full key (starts with `pk_`)
   - **STORE SECURELY** (e.g., 1Password, env file, etc.) — don't share
5. **Find your List ID:**
   - Go to Lists → click "Moriah Community"
   - Copy the ID from the URL (like `abc123def456`)

**You now have:**
- `KLAVIYO_PRIVATE_KEY` = `pk_...`
- `KLAVIYO_COMMUNITY_LIST_ID` = `abc123def456`

**Keep both handy for next task.**

---

## TASK 3: SET UP SHOPIFY DISCOUNT CODE (10 MIN)

Go to **Shopify Admin → Discounts**:

1. **Create new discount** → Percentage
2. **Discount code:** `MIPRIMERTINTO10`
3. **Type:** Percentage off products
4. **Percentage:** 10%
5. **Applies to:** All products
6. **Usage limit:** 500
7. **Active:** Check box
8. **Save**

✅ Code is now live in your store.

---

## TASK 4: ADD ENV VARIABLES TO OXYGEN (10 MIN)

Push environment variables to Oxygen:

```bash
# From storefront/ directory:
npx shopify hydrogen env push

# This opens Oxygen dashboard. Add these env variables:
KLAVIYO_PRIVATE_KEY=pk_...     # Paste from Klaviyo (Task 2)
KLAVIYO_COMMUNITY_LIST_ID=...  # Paste from Klaviyo (Task 2)
```

**Verify in Oxygen dashboard:**
- [ ] Both variables appear under "Environment Variables"
- [ ] Values are not empty

---

## TASK 5: UPLOAD PRODUCER IMAGES (OPTIONAL, 15 MIN)

If you have real producer photos:

1. **Resize to 1024×1280px** (or similar aspect ratio)
2. **Convert to WebP** (use https://cloudconvert.com or local tool)
3. **Upload to:** `storefront/public/images/productores/`
   - `la-esmeralda.webp`
   - `doña-elena.webp`
   - `san-rafael.webp`

**If skipped:** PDPs show "No photo available" (graceful fallback — not blocking)

---

## TASK 6: BUILD & DEPLOY (20 MIN)

```bash
# From storefront/ directory:
npm run build

# This validates everything (TypeScript, ESLint, etc.)
# Output should say: "Production build succeeded"

# If errors, fix them (ESLint warnings are usually auto-fixable: npx eslint --fix .)

# Deploy to Oxygen:
npx shopify hydrogen deploy

# Follow the prompts to select a deployment target
# (should suggest your existing "Cafe-Moriah" storefront)
```

**Verification:** After deploy, visit your live storefront and check:
- [ ] Hero narrative visible
- [ ] Nav link works
- [ ] Form page loads
- [ ] Submit form works

---

## TASK 7: SET UP KLAVIYO EMAIL AUTOMATION (30 MIN)

This is the glue that makes everything work. Go to **Klaviyo → Automations**:

### Automation 1: Welcome Flow
1. **Trigger:** Event = "Story Submitted"
2. **Flow:**
   - **Email #1** (2 hours after event)
     - Subject: "Yo no aprendí a querer el café. Lo heredé."
     - Body: Copy from `app/data/email-templates.js` → `welcome_1.body`
   
   - **Email #2** (24 hours after event)
     - Subject: "Bienvenido al Club de la Memoria"
     - Body: Copy from `welcome_2.body`
   
   - **Email #3** (48 hours after event, CONDITIONAL: if 3+ stories)
     - Subject: "Las historias que hemos recibido esta semana"
     - Body: Copy from `welcome_3.body`
   
   - **Email #4** (7 days after event)
     - Subject: "¿A qué te recuerda a ti el olor a café?"
     - Body: Copy from `welcome_4.body`
   
   - **Email #5** (14 days after event)
     - Subject: "Historias de la Tierra: Conoce a {{producer_name}}"
     - Body: Copy from `welcome_5.body`
     - **Personalization:** 
       - {{producer_name}} = rotate through [Familia Restrepo, Doña Elena, Cooperativa San Rafael]
       - {{producer_story}} = same rotation

3. **Save automation** → Turn ON

### Automation 2: Post-Purchase (Shopify Integration)
**This one is semi-automatic:**

1. **Go to Shopify integration in Klaviyo**
2. **Confirm "Purchase" event is flowing** (it should be by default)
3. **Create a new flow:**
   - Trigger: Purchase
   - Email #1: Same "Heredé" welcome email (different delay: 2h post-purchase)
   - Continue with welcome flow emails

**Both automations run independently:**
- Story Submitted → Welcome flow triggers
- Purchase → Purchase flow triggers
- (User might receive emails from both if they do both)

---

## TASK 8: SMOKE TEST (15 MIN)

Test the complete flow end-to-end:

### Test 1: Memory Form
1. Visit https://yoursite.com/memoria
2. Fill form with test data:
   - Name: "Test User"
   - Email: your-email@example.com
   - City: "Test City"
   - Story: "This is a test story about coffee memories that is definitely long enough to meet the minimum character requirement for validation and submission to the system."
   - Consent: ✅ Check
3. Click "Compartir mi historia"
4. **Expected:** Redirect to `/memoria/gracias` with `MIPRIMERTINTO10` code displayed
5. **Verify in Klaviyo:** 
   - Check "Moriah Community" list → new contact should appear
   - Check "Events" → "Story Submitted" event logged
   - Email #1 should be scheduled to send in 2 hours

### Test 2: Email Delivery (24+ hours later)
- Check your test email inbox for "Heredé" email
- If it doesn't arrive in 24h, troubleshoot Klaviyo

---

## TASK 9: PRODUCTION CHECKLIST (BEFORE PROMOTION) (10 MIN)

Before telling users about this, verify:

- [ ] Form doesn't 500 error on bad input (validation works)
- [ ] Discount code works in Shopify checkout (test as customer)
- [ ] Form submission creates Klaviyo event (check in Klaviyo dashboard)
- [ ] Email #1 is scheduled (check Klaviyo automation)
- [ ] No console errors in browser DevTools
- [ ] Mobile: Form is responsive (test on phone)
- [ ] PDP: Producer blocks display correctly (test all 3 coffees)
- [ ] Homepage: Hero narrative visible and not cut off
- [ ] Navigation: All links work (desktop + mobile)

---

## OPTIONAL: UPLOAD REAL PRODUCER STORIES (TODAY OR THIS WEEK)

The producer stories in `app/data/cafes.js` are now real (not placeholders). But if you want to make them even more authentic:

1. **Contact the actual producers** (or fill from existing records):
   - Familia Restrepo — ask for their story
   - Doña Elena — quote from interviews
   - Cooperativa San Rafael — document background
2. **Replace the placeholder copy** in `app/data/cafes.js` → `story` field
3. **Redeploy** (`npm run build && npx shopify hydrogen deploy`)

**Not blocking:** The stories are already compelling; this is a "nice-to-have" for maximum authenticity.

---

## TIMELINE SUMMARY

| Task | Time | Status |
|------|------|--------|
| Verify build | 30 min | ⏳ START HERE |
| Klaviyo setup | 15 min | ↓ |
| Shopify discount | 10 min | ↓ |
| Env variables | 10 min | ↓ |
| Producer images | 15 min | (Optional) |
| Build & deploy | 20 min | ↓ |
| Klaviyo automation | 30 min | ↓ |
| Smoke tests | 15 min | ↓ |
| Pre-launch checklist | 10 min | END ✅ |
| **TOTAL** | **~2.5 hours** | **OR ~4h with producer images** |

---

## IF SOMETHING BREAKS

1. **Check the error message** (console, Oxygen logs)
2. **Search `NARRATIVE-TRANSFORMATION-EXECUTED.md`** for the error
3. **Ask Claude Code** with the specific error + context
4. **Known issues & fixes:**
   - "KLAVIYO_PRIVATE_KEY not set" → Normal on local dev; only matters when calling Klaviyo API
   - Form validation error → Check Zod schema in `MemoryForm.jsx`
   - 500 error on form submit → Check Oxygen logs (likely Klaviyo API down or bad key)
   - Images not showing → Check file paths in `public/images/productores/`

---

## SUCCESS LOOKS LIKE THIS

After all tasks are done:

✅ Site deployed to production  
✅ `/memoria` form fully functional  
✅ Hero narrative "Heredé" live  
✅ Discount code working  
✅ Klaviyo capturing events + emails scheduled  
✅ Producer stories visible on PDPs  
✅ No console errors  

**You're ready to:**
- [ ] Announce #MiPrimerTinto on social media
- [ ] Send first batch of stories to community via email
- [ ] Monitor form submissions + engagement
- [ ] Iterate on messaging based on early feedback

---

## WHAT NOT TO DO YET

❌ Don't create admin dashboard (`/admin/stories`) — defer to Phase 2  
❌ Don't set up n8n PDF automation — defer to Phase 2  
❌ Don't create podcast routes yet — content-driven, Phase 2+  
❌ Don't worry about book production — Phase 4  
❌ Don't stress about influencer partnerships — Phase 2–3  

**Phase 1A is NARRATIVE + LEAD CAPTURE. That's done. Ship it.**

---

## RESOURCES

- **Setup guide:** `NARRATIVE-TRANSFORMATION-EXECUTED.md`
- **Strategic overview:** `IMPLEMENTATION-PLAN-12M.md`
- **Email templates:** `app/data/email-templates.js`
- **Playwright testing:** `app/routes/memoria._index.jsx` (if you want to write E2E tests)

---

## QUESTIONS?

If stuck on any step:

1. **Check the docs** (linked above)
2. **Re-read the error message** (often tells you exactly what's wrong)
3. **Ask Claude Code** with:
   - The exact error
   - What you were trying to do
   - What already works

---

**You've got this. Execute the 9 tasks above and you'll have a fully functional narrative transformation live in production.**

**Estimated time: 2.5–4 hours. Do it today, then celebrate.** 🚀

---

*Ready to ship?*  
*Go to TASK 1: npm install*
