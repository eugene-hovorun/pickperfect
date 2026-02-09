# PickPerfect — Color Picker for Developers

Modern color picker Chrome extension using native EyeDropper API. Zero DOM injection, zero content scripts, can't break your apps.

Built with **Svelte 5 + Tailwind CSS** for a clean, maintainable codebase.

## Features

**Free:**

- 🎯 Pick colors from **entire screen** (not just browser)
- 📋 One-click copy: HEX, RGB, HSL
- 🕐 History (20 colors, persisted)
- ⌨️ Keyboard shortcut: `Ctrl+Shift+C`

**Premium ($2.99 one-time):**

- ✅ WCAG Contrast Checker — accessibility compliance
- 🎨 Tailwind Color Mapping — nearest match from 242 colors
- 📦 Page Palette Extraction — smart color extraction

## Quick Start

```bash
npm install
npm run dev      # Development
npm run build    # Production
```

**Load in Chrome:**

1. `npm run build`
2. `chrome://extensions/` → Enable Developer mode
3. Load unpacked → Select `dist/` folder

## Stack

- **Svelte 5** (runes) + TypeScript
- **Tailwind CSS** (no runtime components)
- **Vite 6** — fast builds
- **Chrome Manifest V3**
- **Native EyeDropper API** (Chrome 95+)
- **ExtensionPay** — payment processing

## Architecture

### Design Principles

- ✅ Readable over clever
- ✅ Composable components
- ✅ Utility-first CSS (Tailwind)
- ✅ Path aliases (`$lib/*`)
- ✅ Small bundle (~40KB)

### Structure

```
src/
  lib/
    colors.ts              — Color math + WCAG
    storage.ts             — chrome.storage wrapper
    tailwind.ts            — 242 Tailwind colors
    paletteExtractor.ts    — DOM color extraction
    utils.ts               — cn() helper

  popup/
    App.svelte             — Router + premium check
    FreePopup.svelte       — Free tier (120 lines)
    PremiumPopup.svelte    — Premium tier (160 lines)

    components/
      Header.svelte        — Logo + format pills
      PickButton.svelte    — Pick CTA
      Tabs.svelte          — Tab navigation
      ColorTab.svelte      — Swatch + history
      CompareTab.svelte    — Contrast checker
      UpgradePrompt.svelte — Premium upsell
      ColorSwatch.svelte   — Color preview
      FormatPills.svelte   — HEX/RGB/HSL switcher
      HistoryGrid.svelte   — 8×3 grid
      ContrastChecker.svelte — AA/AAA badges
      TailwindMatch.svelte   — Tailwind mapping
      PaletteExtractor.svelte — Palette tool

  background/
    index.ts              — Service worker + ExtPay
```

**Code Stats:**

- Total: ~900 lines (47% reduction from initial 1,744 lines)
- Bundle: ~40KB minified
- Zero custom CSS (100% Tailwind utilities)

## Premium Features

**1. WCAG Contrast Checker**

- Select 2 colors from history
- Real-time ratio (e.g., "4.8:1")
- AA/AAA compliance badges
- Large text vs normal text

**2. Tailwind Color Mapping**

- Instant nearest match
- Accuracy % (e.g., "98% match to blue-500")
- Side-by-side comparison
- Copy-ready: `className="text-blue-500"`

**3. Page Palette Extraction**

- Extract from any webpage (on-demand)
- Smart grouping (similar shades)
- Type detection (background/text/border)
- Frequency sorting
- Click to copy

## Privacy

**What we use:**

- `storage` — Save history & preferences
- `activeTab` — Palette extraction (on-demand)
- `scripting` — Inject extraction script (on-demand)

**What we DON'T do:**

- ❌ No tracking
- ❌ No analytics
- ❌ No ads
- ❌ No persistent scripts
- ❌ No background activity

## Development

**Import style:**

```typescript
// ✅ Good
import { cn } from "$lib/utils";

// ❌ Bad
import { cn } from "../../lib/utils";
```

**Component extraction criteria:**

- Used 2+ times OR
- > 50 lines OR
- Clear single responsibility

## Build

```bash
npm run build
```

Output: `dist/` folder

- Popup bundle (~40KB)
- Background worker
- Assets + icons
- ExtPay.js

## License

MIT

## Support

Email: 5797565@gmail.com

---

Built for developers who value clean code, minimal permissions, and tools that just work.
