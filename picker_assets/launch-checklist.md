# PickPerfect - Launch Checklist & Submission Guide

## Pre-Submission Checklist

### ✅ Code & Build

- [x] All features implemented and tested
- [x] Premium features complete (contrast, Tailwind, palette)
- [x] ExtensionPay integrated
- [x] Error handling for all edge cases
- [x] Clipboard fallback implemented
- [ ] **Build production version:** `npm run build`
- [ ] **Test built extension** in Chrome (load unpacked from `dist/`)
- [ ] **Test in Edge** (optional but recommended)

### ✅ Assets - ALL READY

- [x] Extension icons (16, 48, 128px) ✅
- [x] Promo images:
  - [x] Large promo tile (1400x560px) ✅
  - [x] Small promo tile (440x280px) ✅
- [x] Screenshots (3 images):
  - [x] Hero screenshot (main UI) ✅
  - [x] "Copied!" state screenshot ✅
  - [x] Features overview screenshot ✅

### ✅ Documentation - ALL UPDATED

- [x] manifest.json with correct permissions ✅
- [x] Store listing description ✅
- [x] README.md updated ✅
- [x] GUIDE.md updated ✅

### 🔄 Pre-Launch Setup (TODO)

**1. ExtensionPay Account**

- [ ] Sign up at https://extensionpay.com
- [ ] Create extension "pickperfect"
- [ ] Connect Stripe account
- [ ] Set price: $2.99 one-time
- [ ] Test payment flow in development

**2. Privacy Policy**

- [ ] Create simple privacy policy page
- [ ] Host on GitHub Pages or similar
- [ ] URL needed for Chrome Web Store listing
- [ ] Template: "We don't collect any data. Period."

**3. Support Contact**

- [ ] Set up support email (e.g., support@pickperfect.dev)
- [ ] Or use Gmail if domain not ready yet
- [ ] Add to manifest.json homepage_url (optional)

---

## Chrome Web Store Submission Guide

### Step 1: Create Developer Account

1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time developer registration fee
3. Complete developer account setup

### Step 2: Create New Item

1. Click "New Item" in developer console
2. Upload `dist.zip` (zip your entire `dist/` folder after build)
3. Fill in store listing:

### Step 3: Store Listing Details

**Product details:**

```
Name: PickPerfect — Color Picker for Developers
Summary: Pick colors from any pixel. Copy as HEX, RGB, HSL instantly.
Description: [Use store-listing.md content]
Category: Developer Tools
Language: English
```

**Graphic assets:**

- Icon: `store-icon-128.png`
- Screenshots: Upload all 3 screenshot PNG files
- Promo images:
  - Small tile: `promo-small-440x280.png`
  - Marquee: `promo-marquee-1400x560.png`

**Privacy practices:**

```
Single purpose: Color picking and format conversion
Host permissions: Explain "activeTab for palette extraction only"
Personal data: None collected
Privacy policy: [Your hosted privacy policy URL]
```

**Distribution:**

```
Visibility: Public
Regions: All countries
Pricing: Free with in-app purchases
```

### Step 4: Submit for Review

1. Review all information
2. Click "Submit for review"
3. Wait 1-7 days for approval

**Expected timeline:**

- First review: 3-5 business days
- If changes requested: 1-2 days to fix, 1-3 days for re-review
- Total: 5-10 days to go live

---

## Post-Submission Tasks

### While Waiting for Approval

**1. Prepare Launch Content**

Reddit posts (draft in advance):

```markdown
Title: I built PickPerfect - a color picker that doesn't break your React apps

Body:
After using ColorZilla and having it break my Next.js SSR, I built a better color picker.

Features:
• Native EyeDropper API (zero DOM injection)
• Actually working clipboard
• WCAG contrast checker
• Finds nearest Tailwind colors
• Extract full page palettes

Free on Chrome Web Store, $2.99 for premium features.

No tracking, no ads, minimal permissions.

[Link when approved]
```

Twitter/X thread:

```
I got tired of color pickers that:
❌ Break React hydration
❌ Have broken clipboards
❌ Inject random DOM attributes
❌ Turn into spyware (looking at you, Geco)

So I built PickPerfect 🎯

Thread on why it's different 👇

1/ Uses Chrome's native EyeDropper API
No content scripts = can't break your apps
No "cz-shortcut-listen" attrs = no SSR errors

2/ Premium features for developers:
• WCAG contrast checker (AA/AAA)
• Nearest Tailwind color finder
• Page palette extraction

All for $2.99 one-time (not $3/month like CSS Peeper)

3/ Trust built-in:
✅ Only 3 permissions (transparent)
✅ No tracking
✅ No ads
✅ On-demand palette extraction only

Get it free: [Chrome Web Store link]
```

**2. Create Product Hunt Submission**

- [ ] Draft Product Hunt listing
- [ ] Prepare demo GIF/video
- [ ] Schedule launch for Tuesday-Thursday (best days)
- [ ] Prepare tagline: "Color picker for developers that doesn't break your apps"

**3. Prepare Landing Page (Optional)**

- [ ] Buy pickperfect.dev domain
- [ ] Simple one-pager with:
  - Hero: "Color picker for developers"
  - Problem: "Why other pickers suck"
  - Solution: "How PickPerfect is different"
  - Features showcase
  - CTA: "Install from Chrome Web Store"
  - SEO target: "best color picker chrome extension 2026"

---

## Launch Day Checklist

**When Extension is Approved:**

### Day 1 - Launch

- [ ] Extension live on Chrome Web Store ✅
- [ ] Post to r/webdev
- [ ] Post to r/frontend
- [ ] Post to r/tailwindcss
- [ ] Post to r/chrome
- [ ] Tweet announcement
- [ ] Submit to Product Hunt
- [ ] Post on LinkedIn (if applicable)
- [ ] Send to dev friends/colleagues

### Day 2-3 - Engagement

- [ ] Reply to all comments/questions
- [ ] Monitor Chrome Web Store reviews
- [ ] Fix any critical bugs immediately
- [ ] Thank early adopters

### Day 4-7 - Growth

- [ ] Write Dev.to article: "Building a Better Color Picker"
- [ ] Email web dev newsletters (optional)
- [ ] Reach out to YouTube tech creators (optional)
- [ ] Monitor ExtensionPay for first premium sales 💰

---

## Marketing Copy Templates

### Reddit Template

```markdown
**Title:** [Launch] PickPerfect - Color picker that won't break your React apps

**Body:**
Hey r/webdev!

I just launched PickPerfect, a color picker extension I built after getting frustrated with existing options.

**The Problem:**

- ColorZilla injects `cz-shortcut-listen` and breaks Next.js SSR
- Eye Dropper's last update made picking impossible
- Geco literally turned into spyware
- None support Tailwind or accessibility checking

**My Solution:**

- Uses native Chrome EyeDropper API (zero DOM injection)
- Clipboard that actually works (with fallback)
- Premium: WCAG contrast checker, Tailwind color finder, palette extraction
- $2.99 one-time (not subscription)

**Tech Stack:**
Svelte 5, TypeScript, Manifest V3, zero analytics/tracking

Free on Chrome Web Store: [link]

Open to feedback! Built this as a weekend project and happy to add features the community wants.
```

### Product Hunt Template

```markdown
**Tagline:** Color picker for developers that doesn't break your apps

**Description:**
PickPerfect is a color picker extension built for developers who are tired of:
• Broken clipboards
• DOM injection breaking React/Next.js apps  
• Ugly UIs from 2012
• Extensions turning into spyware

Built with the native EyeDropper API, zero content scripts, and developer-focused premium features:
• WCAG contrast checker for accessibility
• Find nearest Tailwind CSS colors
• Extract full page color palettes
• All for $2.99 one-time

No tracking. No ads. Minimal permissions. Just works.

**First Comment:**
Hey PH! 👋

I built PickPerfect after ColorZilla broke my Next.js app one too many times.

Key differentiators:

1. Native API = can't break your apps
2. Tailwind integration (242 colors built-in)
3. WCAG accessibility checking
4. Privacy-first (no tracking, minimal permissions)

The free tier gives you the core color picking. Premium ($2.99 one-time) unlocks the developer workflow features.

Would love your feedback! What other features would make this indispensable for you?
```

---

## Success Metrics to Track

### Week 1

- [ ] 100+ installs
- [ ] 4.0+ star rating
- [ ] 5+ Chrome Web Store reviews
- [ ] 1+ premium sales

### Month 1

- [ ] 1,000+ installs
- [ ] 4.5+ star rating
- [ ] 20+ reviews
- [ ] 10+ premium sales ($30)
- [ ] <10% uninstall rate

### Month 3

- [ ] 5,000+ installs
- [ ] 4.5+ star rating maintained
- [ ] 50+ reviews
- [ ] 100+ premium sales ($300)
- [ ] Featured on at least one blog/newsletter

---

## Common Rejection Reasons & How to Avoid

**1. Unclear permission justification**

- ✅ Fixed: Store listing clearly explains why we need activeTab/scripting
- Mention: "activeTab and scripting only for on-demand palette extraction"

**2. Privacy policy missing**

- ⚠️ TODO: Host simple privacy policy before submission
- Template: "We don't collect any data. Colors stay local. No tracking."

**3. Misleading screenshots**

- ✅ Fixed: Screenshots show actual extension UI, no mockups

**4. Single purpose violation**

- ✅ Not an issue: Extension has clear single purpose (color picking)

**5. Spam/keyword stuffing**

- ✅ Fixed: Description is natural, no keyword spam

---

## Emergency Response Plan

**If Extension Gets Rejected:**

1. **Read rejection email carefully**
2. **Fix the specific issue mentioned**
3. **Document the fix in resubmission notes**
4. **Resubmit within 24 hours**
5. **Usually approved on second review**

**If Critical Bug Found After Launch:**

1. **Fix immediately in codebase**
2. **Build new version, bump version number in manifest**
3. **Submit update to Chrome Web Store**
4. **Post update in Chrome Web Store reviews**
5. **Update affected users via reviews**

**If ExtensionPay Issues:**

1. **Test payment flow before launch**
2. **Have backup plan: Stripe Checkout**
3. **ExtensionPay support is responsive**

---

## Final Pre-Launch Checklist

**Code:**

- [ ] `npm run build` completes without errors
- [ ] Dist folder is clean and complete
- [ ] ExtPay.js is copied to dist/
- [ ] All assets are in dist/icons/

**Testing:**

- [ ] Load unpacked extension works
- [ ] Eyedropper picks colors correctly
- [ ] Clipboard copies in all formats
- [ ] History persists across sessions
- [ ] Premium check flow works (mock with ExtensionPay trial)
- [ ] Contrast checker calculates correctly
- [ ] Tailwind matching finds correct colors
- [ ] Palette extraction works on various sites

**Store Listing:**

- [ ] All text reviewed for typos
- [ ] Screenshots uploaded
- [ ] Promo images uploaded
- [ ] Privacy policy URL ready
- [ ] Support email set

**Ready to submit!** 🚀

---

## Post-Launch Next Steps

### If Successful (1,000+ installs in Month 1)

**Double down:**

- Add requested features from reviews
- Create landing page with SEO
- Write technical blog post
- Reach out to Tailwind team for potential feature
- Consider Firefox/Edge versions

### If Slow Start (<100 installs in Week 1)

**Iterate:**

- Improve store listing copy
- Better screenshots showing value
- More aggressive Reddit posting
- Free trial of premium features?
- A/B test pricing ($1.99 vs $2.99)

### If Premium Conversion is Low (<1%)

**Investigate:**

- Are people seeing premium features?
- Is $2.99 too high?
- Is value prop clear?
- Consider time-limited discount for early adopters
- Add more premium features to justify price

---

**You're ready to launch! All assets are complete and professional. Good luck! 🎯**
