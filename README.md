# PickPerfect — Color Picker for Developers

A modern, fast, trustworthy color picker Chrome extension. Uses the native `EyeDropper` API — zero content scripts, zero DOM injection, can't break your apps.

## Features (Free)

- 🎯 Native EyeDropper — pick colors from any pixel on screen
- 📋 One-click copy in HEX, RGB, HSL
- 🕐 Color history (persisted, up to 20 colors)
- ⌨️ Keyboard shortcut: `Ctrl+Shift+C`
- 🔒 Minimal permissions — only `storage`

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

## File Structure

```
src/
  popup/App.svelte        ← Entire popup UI
  popup/main.ts           ← Mount point
  background/index.ts     ← Service worker
  lib/colors.ts           ← HEX ↔ RGB ↔ HSL conversion
  lib/storage.ts          ← chrome.storage.local wrapper
public/
  manifest.json           ← Manifest V3
  icons/                  ← Extension icons
popup.html                ← Popup entry point
```
