# PickPerfect — Color Picker for Developers

A modern, fast, trustworthy color picker Chrome extension. Uses the native `EyeDropper` API — zero content scripts, zero DOM injection, can't break your apps.

## Features (Free)

- 🎯 Native EyeDropper — pick colors from any pixel on screen
- 📋 One-click copy in HEX, RGB, HSL
- 🕐 Color history (persisted, up to 20 colors)
- ⌨️ Keyboard shortcut: `Ctrl+Shift+C`
- 🔒 Minimal permissions — only `storage`

## Features (Premium) – Coming Soon

- 📦 Export to Tailwind, CSS variables, SCSS, JSON tokens
- ✅ WCAG contrast checker
- 🎨 Palette extraction from pages
- 💾 Saved palette collections

## Development

```bash
npm install
npm run build
```

## Load in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `dist/` folder

## Stack

- Svelte 5 (runes) + TypeScript
- Vite 6
- Chrome Manifest V3
- Native EyeDropper API (Chrome 95+)
- ExtensionPay for premium features

## File Structure

```
src/
  popup/
    App.svelte                    ← Premium check + routing
    components/
      FreePopup.svelte            ← Free tier UI
      PremiumPopup.svelte         ← Premium tier UI
    main.ts                       ← Mount point
  background/
    index.ts                      ← Service worker + ExtPay
  lib/
    colors.ts                     ← HEX ↔ RGB ↔ HSL conversion
    storage.ts                    ← chrome.storage.local wrapper
public/
  manifest.json                   ← Manifest V3 + ExtPay config
  icons/                          ← Extension icons
popup.html                        ← Popup entry point
vite.config.ts                    ← Build + ExtPay.js copy plugin
```

## ExtPay Integration

Premium features use [ExtensionPay](https://extensionpay.com). Premium status is cached in `chrome.storage.local` for instant popup loading.
