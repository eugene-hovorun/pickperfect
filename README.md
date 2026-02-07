# PickPerfect — Color Picker for Developers

A modern, fast, trustworthy color picker Chrome extension. Uses the native `EyeDropper` API — zero content scripts, zero DOM injection, can't break your apps.

## Features (Free)

- 🎯 Native EyeDropper — pick colors from any pixel on screen
- 📋 One-click copy in HEX, RGB, HSL
- 🕐 Color history (persisted, up to 20 colors)
- ⌨️ Keyboard shortcut: `Ctrl+Shift+C`
- 🔒 Minimal permissions — transparent & trustworthy

## Features (Premium - $2.99 one-time)

- ✅ **WCAG Contrast Checker** — Compare two colors for accessibility compliance
- 🎨 **Tailwind Color Mapping** — Find nearest Tailwind CSS color instantly
- 📦 **Page Palette Extraction** — Extract all colors from any webpage on-demand
- 🎯 Perfect for design systems, accessibility audits, and Tailwind workflows

## Development

```bash
npm install
npm run dev      # Development mode with hot reload
npm run build    # Production build
```

## Load in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `dist/` folder

## Stack

- **Svelte 5** (runes) + TypeScript
- **Vite 6** for blazing fast builds
- **Chrome Manifest V3**
- **Native EyeDropper API** (Chrome 95+)
- **ExtensionPay** for premium features

## Architecture

```
src/
  lib/
    colors.ts              — Color math + WCAG contrast + distance
    storage.ts             — chrome.storage wrapper
    useColorPicker.ts      — Shared utilities
    tailwind.ts            — All Tailwind v3.4 colors (242 colors)
    paletteExtractor.ts    — On-demand palette extraction

  popup/
    App.svelte             — Routing + premium check
    FreePopup.svelte       — Free tier UI
    PremiumPopup.svelte    — Premium tier UI + 3 features
    main.ts                — Entry point

    components/
      ColorSwatch.svelte   — Preview card
      FormatPills.svelte   — Format switcher
      HistoryGrid.svelte   — Color history
      ContrastChecker.svelte — WCAG contrast checker
      TailwindMatch.svelte — Tailwind mapping
      PaletteExtractor.svelte — Palette extraction

  background/
    index.ts               — Service worker + ExtPay integration

public/
  manifest.json            — Manifest V3 + permissions
  icons/                   — Extension icons
```

**Total:** ~1,100 lines (clean, maintainable)

## Premium Features Deep Dive

### 1. WCAG Contrast Checker

- Click "Compare" button
- Select two colors from history
- See real-time contrast ratio (e.g., "4.8:1")
- AA/AAA compliance badges for large/normal text
- Perfect for accessibility audits

### 2. Tailwind Color Mapping

- Pick any color → instantly see nearest Tailwind match
- Shows match accuracy % (e.g., "98% match to blue-500")
- Visual side-by-side comparison
- Ready-to-copy usage: `className="text-blue-500"`
- All 242 Tailwind v3.4 colors included

### 3. Page Palette Extraction

- Extract all colors from any webpage on-demand
- Smart grouping to reduce similar shades
- Color type detection (background, text, border, mixed)
- Frequency sorting (most-used colors first)
- Click any color to add to history + copy
- Perfect for design system analysis

## Privacy & Permissions

**We only ask for what we need:**

- `storage` — Save your color history and preferences
- `activeTab` — Extract colors from current tab (on-demand only)
- `scripting` — Inject extraction script when you click the button

**What we DON'T do:**

- ❌ No tracking or analytics
- ❌ No data collection
- ❌ No ads
- ❌ No persistent content scripts
- ❌ No background activity (palette extraction only runs when you click)

## ExtensionPay Integration

Premium features use [ExtensionPay](https://extensionpay.com) for payment processing. Premium status is cached in `chrome.storage.local` for instant popup loading.

## Building for Production

```bash
npm run build
```

The `dist/` folder contains:

- Popup bundle (~45KB minified)
- Background worker bundle
- All assets and icons
- ExtPay.js (copied from node_modules)

## License

MIT (pending)

## Support

For issues, feature requests, or questions:

- Email: 5797565@gmail.com (pending)
- GitHub Issues: (coming soon)

---

Built with ❤️ for developers who value clean code, minimal permissions, and tools that just work.
