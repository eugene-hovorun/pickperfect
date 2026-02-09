# PickPerfect — Project Spec & Guide

## Context for AI Assistant

This document captures all research, decisions, and implementation details for the PickPerfect Chrome extension. Use it as the single source of truth.

---

## What We Built

A modern, trustworthy, developer-focused color picker Chrome extension with a freemium model ($2.99 one-time for premium). **All premium features are complete and ready to ship.**

## Why This Can Win — Competitive Research Summary

We analyzed the top 5 color picker extensions and their reviews. Here are the recurring pain points we're exploiting:

### Top Competitors & Their Problems

| Extension            | Users | Rating | Key Weakness                                                                                                |
| -------------------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------- |
| ColorZilla           | 10M+  | 4.6★   | Clipboard broken, injects `cz-shortcut-listen` breaking React/Next.js SSR, outdated UI, confusing history   |
| ColorPick Eyedropper | 2M+   | ~4.3★  | Adware/ads, "may soon no longer be supported" (Manifest V3 issues), dev's site is abandoned, mousemove bugs |
| Eye Dropper          | 1M+   | ~4.4★  | Update broke core picking functionality, users can't figure out new UI                                      |
| Geco Color Picker    | 100K+ | —      | Literally turned into spyware (verified by security researchers, July 2025)                                 |
| CSS Peeper           | —     | loved  | $3/month, more than just colors, designers love the UI quality                                              |

### Universal Complaints Across All Extensions

1. **Clipboard doesn't work reliably** — #1 complaint everywhere
2. **UI is ugly/confusing** — most look like 2012
3. **Breaks other apps** — DOM injection causes SSR hydration errors
4. **Trust/privacy fear** — after Geco spyware incident, users are paranoid
5. **Updates break everything** — Eye Dropper update made picking impossible
6. **No modern workflow export** — nobody exports to Tailwind, CSS variables, design tokens
7. **No smart palette + accessibility** — picking one color is solved; organized palettes with contrast ratios are not

## Our Differentiators

- ✅ Uses native `EyeDropper` API — zero DOM injection, can't break other apps
- ✅ Clipboard that actually works, every time
- ✅ Clean modern UI (CSS Peeper level quality) with shadcn-svelte
- ✅ Minimal permissions, transparent privacy
- ✅ **WCAG contrast checker** — compare colors for accessibility (premium)
- ✅ **Tailwind color mapping** — find nearest Tailwind color instantly (premium)
- ✅ **Page palette extraction** — extract all colors from any page on-demand (premium)

---

## Technical Stack

- **Svelte 5** with runes (reactivity via `$state`, `$derived`, `$effect`)
- **shadcn-svelte** for UI components (Tailwind CSS + bits-ui)
- **Vite 6** with multi-entry build (popup + background)
- **TypeScript** with path aliases (`$lib/*`)
- **Chrome Manifest V3**
- **Native `EyeDropper` API** (Chrome 95+)
- **ExtensionPay** for payment processing

---

## Feature Spec — COMPLETE

### Free Tier (v1.0)

- ✅ Eyedropper via native `EyeDropper` API (Chrome 95+)
- ✅ One-click copy in HEX, RGB, HSL (format persisted)
- ✅ Color history (up to 20 colors, persisted)
- ✅ Keyboard shortcut to open popup (`Ctrl+Shift+C`)
- ✅ Clean, modern popup UI with shadcn-svelte
- ✅ Zero content scripts, zero DOM injection
- ✅ Minimal permissions

### Premium Tier ($2.99 one-time via ExtensionPay) — COMPLETE ✅

**1. WCAG Contrast Checker**

- Compare any two colors for accessibility compliance
- Real-time AA/AAA badges for large and normal text
- Visual contrast ratio display (e.g., "4.8:1")
- Click "Compare" → select 2 colors from history → instant feedback
- **Status:** ✅ Complete (~125 lines)

**2. Tailwind Color Mapping**

- Find nearest Tailwind color for any picked color
- Shows match accuracy % (98% match, exact match, etc.)
- Side-by-side visual comparison
- Ready-to-copy usage: `className="text-blue-500"`
- All 242 Tailwind v3.4 colors included
- **Status:** ✅ Complete (~120 lines component + 280 lines color data)

**3. Page Palette Extraction**

- Extract all colors from any webpage on-demand
- Smart grouping to reduce similar shades
- Color type detection (background, text, border, mixed)
- Frequency sorting (most-used colors first)
- Click any color to add to history + copy
- **Status:** ✅ Complete (~200 lines component + 170 lines extractor)

---

## Architecture

### Design Philosophy: Maintainability + Small Bundle

We balance **maintainability** (easy to read, change, extend) with **code size** (small bundle, fast load):

#### What We Optimize For:

1. **Readable over clever** - Explicit is better than implicit
2. **Composable over monolithic** - Small, focused components
3. **Utility CSS over custom CSS** - shadcn-svelte + Tailwind = ~60% less CSS
4. **Type-safe over loose** - TypeScript everywhere, path aliases for clean imports
5. **Small bundle over feature bloat** - Only ship what users need

#### Trade-offs We Make:

- **Use shadcn-svelte** - Copy components into our codebase (no runtime lib), only ship what we use
- **Inline small utilities** - If it's <10 lines, inline it instead of creating a file
- **Shared components** - Reuse `Button`, `Card`, `Badge` across features instead of custom CSS per component
- **Tree-shakeable** - Tailwind purges unused CSS, Vite tree-shakes unused JS

### File Structure (Current - In Migration to shadcn-svelte)

```
src/
  app.css                    - Tailwind directives + shadcn theme variables

  lib/
    colors.ts                (200 lines) - Color math + WCAG contrast + distance
    storage.ts               (60 lines)  - chrome.storage wrapper
    useColorPicker.ts        (45 lines)  - Shared utilities
    tailwind.ts              (280 lines) - All Tailwind v3.4 colors
    paletteExtractor.ts      (170 lines) - On-demand extraction
    utils.ts                 (6 lines)   - cn() helper for class merging

    components/
      ui/                    - shadcn-svelte components (as needed)
        button.svelte
        card.svelte
        badge.svelte
        separator.svelte
        ... (add only what you use)

  popup/
    App.svelte               (80 lines)  - Routing + premium check
    FreePopup.svelte         (185 lines) - Free tier UI
    PremiumPopup.svelte      (230 lines) - Premium tier UI
    main.ts                  (4 lines)   - Entry point + CSS import

    components/
      ColorSwatch.svelte     (80 lines)  - Preview card
      FormatPills.svelte     (28 lines)  - Format switcher ✅ MIGRATED
      HistoryGrid.svelte     (85 lines)  - Color history
      ContrastChecker.svelte (125 lines) - WCAG checker
      TailwindMatch.svelte   (120 lines) - Tailwind mapping
      PaletteExtractor.svelte (200 lines) - Palette extraction

  background/
    index.ts                 - Service worker + ExtPay integration

public/
  manifest.json              - Manifest V3 + permissions
  icons/                     - 16, 48, 128px PNGs

Config files:
  tailwind.config.js         - Tailwind + shadcn theme
  postcss.config.js          - PostCSS for Tailwind
  components.json            - shadcn-svelte CLI config
  tsconfig.json              - TypeScript + path aliases
  vite.config.ts             - Vite + aliases + ExtPay copy
```

**Current stats:**

- **Total source lines:** ~1,100 lines (before shadcn migration)
- **Target after migration:** ~900 lines (expect 15-20% reduction from removing custom CSS)
- **Bundle size:** ~45KB minified (target: <40KB after migration)

### Migration Progress

| Component        | Status      | Before | After | Savings |
| ---------------- | ----------- | ------ | ----- | ------- |
| FormatPills      | ✅ Complete | 56L    | 28L   | 50%     |
| ColorSwatch      | 🔄 Planned  | 80L    | ~50L  | ~38%    |
| HistoryGrid      | 🔄 Planned  | 85L    | ~55L  | ~35%    |
| ContrastChecker  | 🔄 Planned  | 125L   | ~100L | ~20%    |
| TailwindMatch    | 🔄 Planned  | 120L   | ~95L  | ~21%    |
| PaletteExtractor | 🔄 Planned  | 200L   | ~170L | ~15%    |

**L = Lines of code (including styles)**

### Why shadcn-svelte?

1. **Maintainability** - Consistent design tokens, no CSS to maintain
2. **Small bundle** - No runtime library, copy only what you use (~3-5KB per component)
3. **Accessibility** - Components have proper ARIA attributes built-in
4. **Developer experience** - TypeScript, path aliases, `cn()` helper for conditional classes
5. **Future-proof** - Built on bits-ui (headless primitives), easy to customize

### Premium Flow

1. **Background worker** initializes ExtPay and caches `isPremium` status to storage
2. **Popup opens** → reads from storage immediately (instant UI)
3. **Popup verifies** with ExtPay API in background, updates storage if changed
4. **Conditional rendering:** `<FreePopup />` or `<PremiumPopup />` based on cached status

---

## Permissions

### Required Permissions

```json
{
  "permissions": [
    "storage", // Color history, format preference, premium status
    "activeTab", // Palette extraction from current tab (on-demand only)
    "scripting" // Inject extraction script on-demand
  ],
  "host_permissions": [
    "https://extensionpay.com/*" // Payment processing
  ]
}
```

### Why These Are Safe

**`storage`** - Standard for any extension that saves data  
**`activeTab`** - Only current tab, only when user clicks button (not `<all_urls>`)  
**`scripting`** - On-demand injection, no persistent content scripts  
**`extensionpay.com`** - Payment provider only, no other domains

**Browser Warning Level:** Low/Medium

- No "Read and change all your data on all websites"
- Users understand "access the site you're viewing"

---

## Known Technical Quirks

### EyeDropper API returns RGBA strings on some Linux/Chrome versions

The spec says `sRGBHex` returns `#RRGGBB`, but some Chrome versions on Linux return `RGBA(r, g, b, a)` instead. The `pickColorFromScreen()` function handles both formats — parses RGBA strings and converts to hex.

### Clipboard fallback

Primary: `navigator.clipboard.writeText()`. Fallback: hidden textarea + `document.execCommand('copy')` for edge cases where clipboard API fails in extension context.

### Svelte 5 Runes Limitation

Runes (`$state`, `$effect`, `$derived`) only work inside `.svelte` files, not `.ts` files. Solution: extract utilities to `.ts` files, keep state management in components.

### ExtPay Content Script

ExtPay requires `ExtPay.js` as a content script to handle `onPaid` callbacks. Vite plugin copies this from `node_modules` to `dist/` during build.

### Path Aliases

We use `$lib/*` aliases for cleaner imports:

- `import { cn } from "$lib/utils"` instead of `import { cn } from "../../lib/utils"`
- Configured in both `tsconfig.json` (TypeScript) and `vite.config.ts` (bundling)

---

## ExtensionPay Integration

### manifest.json Requirements

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

### Vite Build Plugin

```typescript
{
  name: 'copy-extpay',
  closeBundle() {
    copyFileSync(
      'node_modules/extpay/dist/ExtPay.js',
      'dist/ExtPay.js'
    );
  }
}
```

### Background Worker Pattern

```typescript
import ExtPay from "extpay";

const extpay = ExtPay("pickperfect");
extpay.startBackground();

// Cache initial status
extpay.getUser().then((user) => {
  chrome.storage.local.set({ isPremium: user.paid });
});

// Update on payment
extpay.onPaid.addListener((user) => {
  chrome.storage.local.set({ isPremium: true });
});
```

---

## Monetization

- **Payment provider:** ExtensionPay
- **Model:** Freemium — free core, $2.99 one-time for premium
- **Premium features:** 3 complete features (contrast, Tailwind, palette)
- **Setup:** Register at extensionpay.com, connect Stripe, set price

---

## Distribution Plan (in priority order)

1. **Chrome Web Store listing** - Professional screenshots, clear value prop
2. **Product Hunt launch** - Developer tools category
3. **Reddit posts** - r/webdev, r/frontend, r/tailwindcss, r/chrome
4. **Twitter/X** - Tag @tailwindcss, show demos
5. **Dev.to article** - "Building a Color Picker That Doesn't Suck"
6. **Landing page** (later) - SEO for "tailwind color picker chrome"

---

## Ready to Ship ✅

### What's Complete

- ✅ All free tier features
- ✅ All 3 premium features
- ✅ Clean, maintainable codebase (~1,100 lines)
- ✅ Privacy-friendly architecture
- ✅ Professional UI/UX with shadcn-svelte (migration in progress)
- ✅ Error handling
- ✅ ExtensionPay integration
- ✅ Path aliases configured (`$lib/*`)

### Pre-Launch Checklist

- ✅ Extension icons (16, 48, 128px)
- ✅ Promo images (1400x560, 440x280)
- ✅ Screenshots (1280x800 or 640x400)
- ✅ Store listing copy
- ✅ Manifest permissions configured
- 🔄 shadcn-svelte migration (in progress, 1/6 components complete)
- [ ] Browser testing (Chrome, Edge)
- [ ] ExtensionPay account setup
- [ ] Privacy policy page
- [ ] Support email

**Status:** Core features ready, UI polish in progress

---

## Key Principles (Maintained)

- ✅ **Small codebase.** Target: <1,000 lines after shadcn migration
- ✅ **Maintainable code.** Readable > clever, composition > complexity
- ✅ **Don't break user's apps.** No DOM injection, native EyeDropper API
- ✅ **Clipboard must work.** Fallback implemented and tested
- ✅ **Trust is a feature.** Minimal permissions, transparent about what we access
- ✅ **Instant UI.** Premium status cached to avoid slow API calls
- ✅ **Quality over features.** 3 well-executed premium features beats 10 half-baked ones
- ✅ **Ship only what's needed.** shadcn components = copy what you use, not everything

---

## Code Quality Standards

### When to Extract a Component

**Extract if:**

- Used in 2+ places
- Complex logic (>50 lines)
- Clear single responsibility

**Don't extract if:**

- Only used once
- <30 lines
- Would create more indirection than clarity

### When to Use shadcn Components

**Use shadcn when:**

- Standard UI pattern (button, card, badge, etc.)
- Need accessibility built-in
- Want consistent styling

**Write custom when:**

- Highly specific to your domain (e.g., color swatch)
- Simple one-off element (<20 lines)
- Performance-critical (though shadcn is fast)

### Import Style

**Always use path aliases:**

```typescript
// ✅ Good
import { cn } from "$lib/utils";
import type { ColorFormat } from "$lib/colors";

// ❌ Bad
import { cn } from "../../lib/utils";
import type { ColorFormat } from "../../lib/colors";
```

---

## Success Metrics

**Target KPIs (Year 1):**

- 10,000+ free users
- 2% conversion rate (200 premium users)
- $600 revenue
- 4.5+ star rating
- <10% uninstall rate

**Stretch Goals:**

- 50,000+ free users
- 3% conversion rate (1,500 premium users)
- $4,500 revenue
- Product Hunt top 5 in Developer Tools
- Featured on r/webdev

---

## What's Next (Post-Launch)

**v1.1 - Polish:**

- Complete shadcn-svelte migration
- Export palettes (Tailwind config, CSS vars, JSON)
- Saved palette collections per project
- Color harmony detection
- Performance optimizations

**v1.2 - Growth:**

- Firefox support
- Safari support (if viable)
- Image upload color extraction
- Gradient extraction

**v2.0 - Advanced (if successful):**

- AI color palette generation
- Brand color recommendations
- Design system linter
- Team features (shared palettes)

---

**Current Status:** Production-ready core, UI refinement in progress with shadcn-svelte.

Let's ship it! 🚀
