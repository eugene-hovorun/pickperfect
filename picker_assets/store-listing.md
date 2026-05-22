# Chrome Web Store Listing

> Ready-to-paste Chrome Web Store copy for PickPerfect.

## Listing Metadata

| Field | Value |
| --- | --- |
| Name | PickPerfect - Color Picker for Developers |
| Category | Developer Tools |
| Language | English |
| Pricing | Free with in-app purchase |
| Current extension version | 2.2.0 |
| Project video | https://youtu.be/17t8El4sDEI |

## Short Description

Pick colors from anywhere on screen. Copy HEX, RGB, HSL instantly. Native API, minimal permissions, zero tracking.

## Full Description

PickPerfect is a fast, lightweight color picker for developers and designers who want one thing: pick a color and copy it instantly.

Project video: https://youtu.be/17t8El4sDEI

## Pick From The Entire Screen

Most color pickers only work inside the browser window. PickPerfect uses Chrome's native EyeDropper API, so you can pick colors from:

- Websites
- Images
- Videos
- PDFs
- Design files
- Desktop apps
- Anywhere visible on your screen

## No DOM Injection

Some color picker extensions inject scripts or attributes into every page you visit. That can break React hydration, interfere with frontend frameworks, slow down pages, or create confusing debug output.

PickPerfect keeps the core picking flow native:

- No always-on content script
- No DOM mutation for color picking
- No framework interference
- No broad `<all_urls>` permission
- No tracking, ads, or analytics

## How It Works

1. Click the PickPerfect icon or press `Ctrl+Shift+X`.
2. Click any visible pixel on your screen.
3. Copy the color as `HEX`, `RGB`, or `HSL`.
4. Reuse previous colors from your local history.

## Free Features

- Pick any color from your entire screen
- Copy as `HEX`, `RGB`, or `HSL`
- Save the last 20 picked colors
- Keep your preferred copy format between sessions
- Remove saved colors from history
- Use the keyboard shortcut `Ctrl+Shift+X`
- Work with a clean, focused popup UI

## Premium Features

PickPerfect Premium is a one-time upgrade for deeper frontend and design-system work.

### WCAG Contrast Checker

Compare two colors and instantly see accessibility results for normal and large text, including AA and AAA ratings.

### Tailwind Color Mapping

Find the nearest Tailwind CSS color from the bundled palette and copy class-ready values for faster implementation.

### Page Palette Extraction

Extract colors from the current page on demand, group similar shades, and identify likely background, text, and border usage.

## Why Developers Use PickPerfect

PickPerfect is built for people who have been burned by color pickers that:

- Break app markup
- Inject unexpected page attributes
- Ship cluttered interfaces
- Have unreliable clipboard behavior
- Add ads, tracking, or suspicious updates
- Work only inside the browser viewport

PickPerfect focuses on a smaller, cleaner promise: accurate color picking, reliable copying, minimal permissions, and developer-friendly extras.

## Privacy

PickPerfect does not collect personal data.

- No tracking
- No analytics
- No ads
- No background page scanning
- No uploaded color history
- Palette extraction runs only when you request it

Your color history and preferences stay in Chrome's local extension storage.

## Technical Details

- Built with Svelte 5 and TypeScript
- Styled with Tailwind CSS
- Chrome Manifest V3 extension
- Uses Chrome's native EyeDropper API
- Requires Chrome 95 or newer
- Payment flow powered by ExtensionPay

## Keyboard Shortcut

Default shortcut:

```text
Ctrl+Shift+X
```

You can customize it here:

```text
chrome://extensions/shortcuts
```

---

Built for developers who value clean code, minimal permissions, and tools that just work.

## Release Notes: 2.2.0

```text
Updated the extension package and refreshed the Chrome Web Store visual assets for the 2.2.0 release.
```
