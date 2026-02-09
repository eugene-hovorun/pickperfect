# PickPerfect — Color Picker for Developers

A modern, fast, trustworthy color picker Chrome extension. Uses the native `EyeDropper` API — zero content scripts, zero DOM injection, can't break your apps.

Built with **Svelte 5 + shadcn-svelte** for a clean, maintainable codebase.

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
- **shadcn-svelte** - UI components with Tailwind CSS
- **Vite 6** for blazing fast builds
- **Chrome Manifest V3**
- **Native EyeDropper API** (Chrome 95+)
- **ExtensionPay** for premium features

## Architecture

### Design Philosophy

We balance **maintainability** (easy to read, change, extend) with **small bundle size** (fast load, no bloat):

- **Readable over clever** - Code should be obvious, not impressive
- **Composable components** - Small, focused, reusable pieces
- **Utility CSS** - shadcn-svelte + Tailwind = ~60% less custom CSS
- **Type-safe imports** - Path aliases (`$lib/*`) for clean imports
- **Small bundle** - Only ship what users need (~40KB minified)

### File Structure

```
src/
  app.css                    — Tailwind + shadcn theme variables

  lib/
    colors.ts                — Color math + WCAG contrast
    storage.ts               — chrome.storage wrapper
    useColorPicker.ts        — Shared utilities
    tailwind.ts              — All Tailwind v3.4 colors (242 colors)
    paletteExtractor.ts      — On-demand palette extraction
    utils.ts                 — cn() helper for class merging

    components/ui/           — shadcn-svelte components
      button.svelte
      card.svelte
      badge.svelte
      separator.svelte
      ... (add only what you use)

  popup/
    App.svelte               — Routing + premium check
    FreePopup.svelte         — Free tier UI
    PremiumPopup.svelte      — Premium tier UI + 3 features
    main.ts                  — Entry point + CSS import

    components/
      ColorSwatch.svelte     — Preview card
      FormatPills.svelte     — Format switcher
      HistoryGrid.svelte     — Color history
      ContrastChecker.svelte — WCAG contrast checker
      TailwindMatch.svelte   — Tailwind mapping
      PaletteExtractor.svelte — Palette extraction

  background/
    index.ts                 — Service worker + ExtPay integration

public/
  manifest.json              — Manifest V3 + permissions
  icons/                     — Extension icons
```

**Code Stats:**

- Total: ~1,100 lines → ~900 lines (after shadcn migration)
- Bundle: ~45KB → ~40KB minified (expected after migration)
- Custom CSS: Reduced by ~60% with shadcn-svelte

### Why shadcn-svelte?

1. **No runtime library** - Components are copied into your project, you only ship what you use
2. **Consistent design** - All components share the same theme tokens
3. **Accessible by default** - Proper ARIA attributes built-in
4. **Easy to customize** - Built on bits-ui (headless primitives), full control over styling
5. **Small bundle** - ~3-5KB per component, tree-shakeable

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

## Code Quality Standards

### When to Extract a Component

✅ Extract if:

- Used in 2+ places
- Complex logic (>50 lines)
- Clear single responsibility

❌ Don't extract if:

- Only used once and <30 lines
- Would create more indirection than clarity

### When to Use shadcn Components

✅ Use shadcn when:

- Standard UI pattern (button, card, badge, etc.)
- Need accessibility built-in
- Want consistent styling

✅ Write custom when:

- Highly domain-specific (e.g., color swatch)
- Simple one-off element (<20 lines)

### Import Style

Always use path aliases for clean, maintainable imports:

```typescript
// ✅ Good
import { cn } from "$lib/utils";
import type { ColorFormat } from "$lib/colors";

// ❌ Bad
import { cn } from "../../lib/utils";
import type { ColorFormat } from "../../lib/colors";
```

## ExtensionPay Integration

Premium features use [ExtensionPay](https://extensionpay.com) for payment processing. Premium status is cached in `chrome.storage.local` for instant popup loading.

## Building for Production

```bash
npm run build
```

The `dist/` folder contains:

- Popup bundle (~40KB minified, expected after shadcn migration)
- Background worker bundle
- All assets and icons
- ExtPay.js (copied from node_modules)

## Project Status

**Core Features:** ✅ Complete  
**UI Migration:** 🔄 In Progress (shadcn-svelte)  
**Ready to Ship:** Almost there!

Migration Progress:

- [x] FormatPills (50% code reduction)
- [ ] ColorSwatch
- [ ] HistoryGrid
- [ ] ContrastChecker
- [ ] TailwindMatch
- [ ] PaletteExtractor

## License

MIT (pending)

## Support

For issues, feature requests, or questions:

- Email: 5797565@gmail.com (pending)
- GitHub Issues: (coming soon)

---

Built with ❤️ for developers who value:

- Clean, maintainable code
- Minimal permissions
- Tools that just work
- Small bundle sizes
