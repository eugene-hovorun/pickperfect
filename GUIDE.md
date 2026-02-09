# PickPerfect — Project Spec & Guide

Complete technical documentation for the PickPerfect Chrome extension.

## What We Built

Modern color picker Chrome extension with freemium model ($2.99 one-time). Uses native EyeDropper API to pick colors from **entire screen** (not just browser), with zero DOM injection.

## Why This Wins — Competitive Analysis

Top 5 color picker extensions have critical flaws:

| Extension            | Users | Key Weakness                                                     |
| -------------------- | ----- | ---------------------------------------------------------------- |
| ColorZilla           | 10M+  | Injects `cz-shortcut-listen`, breaks React SSR, clipboard broken |
| ColorPick Eyedropper | 2M+   | Adware, Manifest V3 issues, mousemove bugs                       |
| Eye Dropper          | 1M+   | Update broke picking, confusing UI                               |
| Geco Color Picker    | 100K+ | Turned into spyware (July 2025)                                  |
| CSS Peeper           | —     | $3/month subscription                                            |

### Universal Pain Points

1. Clipboard doesn't work reliably
2. Ugly/confusing UI (looks like 2012)
3. Breaks apps via DOM injection
4. Trust/privacy concerns
5. Browser-only (can't pick from desktop/other apps)

## Our Differentiators

✅ **Picks from entire screen** — not limited to browser window  
✅ Native `EyeDropper` API — zero DOM injection, can't break apps  
✅ Clipboard that actually works  
✅ Clean tabbed UI (organized by feature)  
✅ Minimal permissions, transparent privacy  
✅ Premium features: WCAG checker, Tailwind mapping, Palette extraction

## Tech Stack

- **Svelte 5** (runes) + TypeScript
- **Tailwind CSS** (utility-first, zero custom CSS)
- **Vite 6** (fast builds)
- **Chrome Manifest V3**
- **Native EyeDropper API** (Chrome 95+)
- **ExtensionPay** (payment processing)

## Architecture

### Design Philosophy

**Maintainability + Small Bundle**

1. Readable over clever
2. Composable over monolithic
3. Utility CSS over custom CSS (100% Tailwind)
4. Type-safe imports (`$lib/*` aliases)
5. Small bundle (only ship what's needed)

### File Structure

```
src/
  app.css                 — Tailwind + shadcn theme vars

  lib/
    colors.ts             (200L) — Color math, WCAG, distance
    storage.ts            (60L)  — chrome.storage wrapper
    useColorPicker.ts     (45L)  — Shared utilities
    tailwind.ts           (280L) — 242 Tailwind v3.4 colors
    paletteExtractor.ts   (170L) — DOM color extraction
    utils.ts              (6L)   — cn() helper

  popup/
    App.svelte            (40L)  — Router + premium check
    FreePopup.svelte      (120L) — Free tier UI
    PremiumPopup.svelte   (160L) — Premium tier UI

    components/
      Header.svelte       (30L)  — Logo + format pills
      PickButton.svelte   (40L)  — Pick CTA
      Tabs.svelte         (35L)  — Tab navigation
      ColorTab.svelte     (45L)  — Swatch + history
      CompareTab.svelte   (55L)  — Contrast checker
      UpgradePrompt.svelte (60L) — Premium upsell
      ColorSwatch.svelte  (50L)  — Color preview
      FormatPills.svelte  (28L)  — HEX/RGB/HSL switcher
      HistoryGrid.svelte  (56L)  — Color grid
      ContrastChecker.svelte (101L) — WCAG checker
      TailwindMatch.svelte (72L)   — Tailwind mapping
      PaletteExtractor.svelte (132L) — Palette tool

  background/
    index.ts              — Service worker + ExtPay
```

**Code Stats:**

- Total: ~900 lines (47% reduction from 1,744 lines)
- Bundle: ~40KB minified
- Custom CSS: 0 lines (100% Tailwind utilities)

### Component Extraction Strategy

Extracted 6 shared components to eliminate duplication:

- Header, PickButton, Tabs, ColorTab, CompareTab, UpgradePrompt

**Before:** FreePopup 270L, PremiumPopup 340L (lots of duplication)  
**After:** FreePopup 120L, PremiumPopup 160L (~300 lines saved)

### UI Layout

```
┌─────────────────────────────────┐
│ Logo          [HEX][RGB][HSL]   │ ← Header (fixed)
├─────────────────────────────────┤
│ [🎨 Pick a Color]               │ ← Pick button (fixed)
├─────────────────────────────────┤
│ Color │ Tailwind │ Compare │ Palette │ ← Tabs
├─────────────────────────────────┤
│ max-height: 400px (scrollable)  │ ← Tab content
│                                 │
│ - Color: Swatch + History       │
│ - Tailwind: Match display       │
│ - Compare: Select 2 + Checker   │
│ - Palette: Extraction tool      │
└─────────────────────────────────┘
```

## Premium Flow

1. Background worker initializes ExtPay, caches `isPremium` to storage
2. Popup reads from storage (instant load)
3. Verifies with ExtPay in background, updates if changed
4. Renders `<FreePopup />` or `<PremiumPopup />`

## Permissions

```json
{
  "permissions": ["storage"],
  "activeTab": true,
  "scripting": true,
  "host_permissions": ["https://extensionpay.com/*"]
}
```

**Why safe:**

- `storage` — Standard for any extension
- `activeTab` — Current tab only, on-demand
- `scripting` — Palette extraction only, on-demand
- No `<all_urls>` permission

**Browser warning:** Low/Medium (no "read all data" permission)

## Features (Complete)

### Free Tier

✅ EyeDropper (entire screen, not just browser)  
✅ One-click copy (HEX/RGB/HSL)  
✅ Color history (20 colors)  
✅ Keyboard shortcut (`Ctrl+Shift+C`)  
✅ Tabbed UI

### Premium Tier ($2.99)

✅ WCAG Contrast Checker — AA/AAA badges  
✅ Tailwind Color Mapping — 242 colors, match %  
✅ Page Palette Extraction — smart grouping

## Known Quirks

### EyeDropper returns RGBA on some Linux builds

Spec says `sRGBHex` returns `#RRGGBB`, but some Chrome/Linux versions return `RGBA(r,g,b,a)`.
Solution: `pickColorFromScreen()` handles both formats.

### Clipboard Fallback

Primary: `navigator.clipboard.writeText()`  
Fallback: Hidden textarea + `document.execCommand('copy')`

### Svelte 5 Runes Limitation

Runes (`$state`, `$effect`, `$derived`) only work in `.svelte` files, not `.ts`.  
Solution: State in components, utilities in `.ts` files.

### Path Aliases

`$lib/*` configured in `tsconfig.json` and `vite.config.ts`

## ExtensionPay Integration

**manifest.json:**

```json
{
  "permissions": ["storage"],
  "host_permissions": ["https://extensionpay.com/*"],
  "content_scripts": [
    {
      "matches": ["https://extensionpay.com/*"],
      "js": ["ExtPay.js"],
      "run_at": "document_start"
    }
  ]
}
```

**Vite Plugin:** Copies `ExtPay.js` from node_modules to dist/

## Code Quality Standards

### When to Extract Component

✅ Used 2+ places  
✅ >50 lines  
✅ Clear single responsibility

❌ Used once & <30 lines  
❌ Creates indirection without clarity

### Import Style

```typescript
// ✅ Good
import { cn } from "$lib/utils";

// ❌ Bad
import { cn } from "../../lib/utils";
```

## Distribution Plan

1. Chrome Web Store listing (professional screenshots)
2. Product Hunt launch (Developer Tools category)
3. Reddit: r/webdev, r/frontend, r/tailwindcss
4. Twitter/X: Tag @tailwindcss, show demos
5. Dev.to article: "Building a Color Picker That Doesn't Suck"

## Ready to Ship ✅

**Complete:**

- ✅ All free features
- ✅ All 3 premium features
- ✅ Tabbed UI (fixed height, organized)
- ✅ Component extraction (zero duplication)
- ✅ 100% Tailwind utilities (zero custom CSS)
- ✅ ExtensionPay integration
- ✅ Path aliases configured

**Pre-Launch:**

- [ ] Browser testing (Chrome, Edge)
- [ ] ExtensionPay account setup
- [ ] Privacy policy page
- [ ] Support email
- [ ] Screenshots (1280×800 or 640×400)
- [ ] Promo images (1400×560, 440×280)

## Key Principles

✅ Small codebase (~900 lines)  
✅ Maintainable (readable > clever)  
✅ Don't break user's apps (no DOM injection)  
✅ Clipboard must work (fallback implemented)  
✅ Trust is a feature (minimal permissions)  
✅ Instant UI (premium status cached)  
✅ Quality over features (3 well-executed premium features)

## Success Metrics (Year 1)

**Target:**

- 10,000+ free users
- 2% conversion (200 premium)
- $600 revenue
- 4.5+ stars
- <10% uninstall rate

**Stretch:**

- 50,000+ free users
- 3% conversion (1,500 premium)
- $4,500 revenue
- Product Hunt top 5
- Featured on r/webdev

---

**Status:** Production-ready core, ready to ship! 🚀
