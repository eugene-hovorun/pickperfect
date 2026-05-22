# PickPerfect

> Color picker for developers who care about clean workflows, minimal permissions, and tools that do not mutate their pages.

[![Chrome MV3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Privacy](https://img.shields.io/badge/Tracking-none-111827)](#privacy)

PickPerfect is a lightweight Chrome extension for picking colors from anywhere on the screen, copying them in developer-friendly formats, and checking them against real UI workflows.

It uses Chrome's native `EyeDropper` API, so the core picker does not inject content scripts into pages, does not modify the DOM, and does not interfere with React, Next.js, Vue, Angular, or other app runtimes.

## Demo Video

[Watch the project video on YouTube](https://youtu.be/17t8El4sDEI)

---

## Highlights

| Area | What PickPerfect does |
| --- | --- |
| Screen picking | Pick any visible pixel from the full screen, not only the browser viewport. |
| Copy formats | Copy as `HEX`, `RGB`, or `HSL` with one click. |
| History | Keep the last 20 picked colors in local extension storage. |
| Developer tools | Tailwind matching, WCAG contrast checks, and page palette extraction. |
| Privacy | No analytics, ads, tracking, or always-on background collection. |
| Architecture | Svelte 5, TypeScript, Tailwind CSS, Vite, and Chrome Manifest V3. |

## Features

### Free

- Native full-screen color picking with Chrome `EyeDropper`
- One-click copy for `HEX`, `RGB`, and `HSL`
- Persisted color history with quick reuse
- Format preference saved between sessions
- Keyboard shortcut: `Ctrl+Shift+X` / `Command+Shift+X`
- Clean tabbed popup UI

### Premium

| Feature | Purpose |
| --- | --- |
| WCAG Contrast Checker | Compare two colors and see AA/AAA accessibility results for normal and large text. |
| Tailwind Color Mapping | Find the nearest Tailwind CSS color from the bundled palette and copy class-ready values. |
| Page Palette Extraction | Extract page colors on demand, group similar shades, and classify background/text/border usage. |

Premium is designed as a one-time upgrade for deeper design-system and frontend workflows.

## Demo Assets

Store and launch assets live in [`picker_assets/`](./picker_assets/):

- `screenshot_1.png` - primary store screenshot
- `screenshot_2.png` - copied state / workflow screenshot
- `screenshot_3.png` - feature-focused screenshot
- `screenshot_4.png` - additional store screenshot
- `hero_1400x560.png` - Chrome Web Store large promo tile
- `hero_440x280.png` - Chrome Web Store small promo tile
- `store-icon-128.png` - store icon

## Quick Start

```bash
npm install
npm run dev
```

Build the extension for Chrome:

```bash
npm run build
```

Load it locally:

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the generated `dist/` folder.

Create a Chrome Web Store upload zip:

```bash
npm run zip
```

The command builds `dist/` and writes `pickperfect.zip` at the project root.

## Project Structure

```text
.
├── public/
│   ├── manifest.json          # Chrome extension manifest and version
│   └── icons/                 # Runtime extension icons
├── src/
│   ├── background/
│   │   └── index.ts           # MV3 service worker and ExtensionPay bridge
│   ├── lib/
│   │   ├── colors.ts          # Color parsing, conversion, WCAG, distance math
│   │   ├── paletteExtractor.ts# On-demand page palette extraction
│   │   ├── storage.ts         # chrome.storage helpers
│   │   ├── tailwind.ts        # Tailwind color palette data
│   │   ├── theme.ts           # Theme helpers
│   │   ├── useColorPicker.ts  # Shared picker/copy behavior
│   │   └── utils.ts           # Classname utilities
│   └── popup/
│       ├── App.svelte         # Popup entry and premium routing
│       ├── FreePopup.svelte   # Free experience
│       ├── PremiumPopup.svelte# Premium experience
│       └── components/        # Reusable popup UI components
├── picker_assets/             # Store listing, screenshots, promo images
├── popup.html                 # Popup HTML entry
├── vite.config.ts             # Vite + extension build setup
└── package.json               # Scripts and dependencies
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite for local UI development. |
| `npm run build` | Build the production extension into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run zip` | Build and package `dist/` as `pickperfect.zip`. |

## Architecture Notes

PickPerfect is intentionally small and direct:

- **Native first:** the picker relies on Chrome's `EyeDropper` API instead of page-level DOM listeners.
- **On-demand scripts:** palette extraction uses `activeTab` and `scripting` only when the user runs that feature.
- **Component boundaries:** popup UI is split into focused Svelte components instead of a large monolithic popup.
- **Utility styling:** Tailwind utilities keep visual behavior close to the markup.
- **Local persistence:** history and preferences stay in `chrome.storage`.

## Permissions

| Permission | Why it is needed |
| --- | --- |
| `storage` | Save color history, format preference, theme, and premium status cache. |
| `activeTab` | Allow user-triggered palette extraction on the current tab. |
| `scripting` | Inject the extraction function only when palette extraction is requested. |
| `https://extensionpay.com/*` | Support ExtensionPay checkout and premium status verification. |

No `<all_urls>` permission is requested.

## Privacy

PickPerfect is built around a simple privacy promise:

- No tracking
- No analytics
- No ads
- No persistent content scripts
- No background page scanning
- No color history uploaded anywhere

Color history and preferences are stored locally by Chrome.

## Development Guidelines

Use path aliases for internal imports:

```ts
import { cn } from "$lib/utils";
```

Avoid deep relative imports for shared code:

```ts
import { cn } from "../../lib/utils";
```

Extract a component when it has a clear responsibility, is reused, or would make a parent component harder to scan.

## Release

The Chrome Web Store version is controlled by [`public/manifest.json`](./public/manifest.json).

Before uploading a release:

1. Confirm the manifest `version` is the intended store version.
2. Run `npm run build`.
3. Load `dist/` unpacked in Chrome and smoke test the popup.
4. Run `npm run zip`.
5. Upload `pickperfect.zip` in Chrome Web Store Developer Dashboard.

For the full release checklist, see [`picker_assets/launch-checklist.md`](./picker_assets/launch-checklist.md).

## Support

Email: 5797565@gmail.com

## License

MIT
