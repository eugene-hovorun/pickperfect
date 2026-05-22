# PickPerfect Launch Checklist

> Chrome Web Store submission runbook for version `2.2.0`.

## Release Snapshot

| Item | Value |
| --- | --- |
| Product | PickPerfect |
| Store category | Developer Tools |
| Extension version | `2.2.0` |
| Upload artifact | `pickperfect.zip` |
| Build output | `dist/` |
| Store assets folder | `picker_assets/` |
| Project video | `https://youtu.be/17t8El4sDEI` |

## Fast Path

```bash
npm run build
npm run zip
```

Then upload `pickperfect.zip` in Chrome Web Store Developer Dashboard.

## Pre-Submission Checklist

### Code & Build

- [x] Free picking workflow implemented
- [x] Premium features implemented
- [x] ExtensionPay integrated
- [x] Clipboard fallback implemented
- [x] Error handling added for core flows
- [ ] `npm run build` completes without errors
- [ ] Built extension loads from `dist/`
- [ ] `npm run zip` creates `pickperfect.zip`
- [ ] Zip contents are the files inside `dist/`, not a nested `dist/` folder

### Store Assets

- [x] Runtime icons: `public/icons/icon-16.png`, `icon-48.png`, `icon-128.png`
- [x] Store icon: `picker_assets/store-icon-128.png`
- [x] Large promo tile: `picker_assets/hero_1400x560.png`
- [x] Small promo tile: `picker_assets/hero_440x280.png`
- [x] Screenshots:
  - [x] `picker_assets/screenshot_1.png`
  - [x] `picker_assets/screenshot_2.png`
  - [x] `picker_assets/screenshot_3.png`
  - [x] `picker_assets/screenshot_4.png`

### Store Copy

- [x] Store listing copy prepared in `picker_assets/store-listing.md`
- [x] README updated
- [x] Technical guide updated
- [x] Project video linked: `https://youtu.be/17t8El4sDEI`
- [ ] Release notes reviewed
- [ ] Privacy policy URL ready
- [ ] Support email confirmed

## Chrome Web Store Submission

### 1. Developer Account

1. Open `https://chrome.google.com/webstore/devconsole`.
2. Sign in with the publishing account.
3. Confirm the developer account is active.

### 2. Package

1. Open the PickPerfect item.
2. Go to **Package**.
3. Upload `pickperfect.zip`.
4. Confirm Chrome Web Store detects version `2.2.0`.

### 3. Store Listing

| Field | Value |
| --- | --- |
| Name | PickPerfect - Color Picker for Developers |
| Summary | Use the short description from `store-listing.md`. |
| Description | Use the full description from `store-listing.md`. |
| Category | Developer Tools |
| Language | English |

### 4. Graphic Assets

Upload:

- `picker_assets/store-icon-128.png`
- `picker_assets/screenshot_1.png`
- `picker_assets/screenshot_2.png`
- `picker_assets/screenshot_3.png`
- `picker_assets/screenshot_4.png`
- `picker_assets/hero_440x280.png`
- `picker_assets/hero_1400x560.png`

### 5. Privacy Practices

Suggested wording:

```text
PickPerfect's single purpose is color picking, color format conversion, and related developer color workflows.

The extension stores color history and preferences locally in Chrome extension storage. It does not collect, sell, transmit, or share personal data.

The activeTab and scripting permissions are used only when the user explicitly runs page palette extraction. No script runs persistently on every page.
```

Checklist:

- [ ] Single purpose completed
- [ ] Permission justification completed
- [ ] Data usage set to no personal data collected
- [ ] Privacy policy URL added
- [ ] In-app purchase / payment disclosure completed

### 6. Distribution

- [ ] Visibility: Public
- [ ] Regions: All countries, unless there is a reason to limit
- [ ] Pricing: Free with in-app purchases
- [ ] Submit for review

## Smoke Test Matrix

Run these before submission after loading `dist/` unpacked.

| Test | Expected result |
| --- | --- |
| Open popup | UI opens without console errors. |
| Pick color | EyeDropper opens and selected color appears in popup. |
| Copy HEX | Clipboard contains `#RRGGBB`. |
| Copy RGB | Clipboard contains `rgb(r, g, b)`. |
| Copy HSL | Clipboard contains `hsl(h, s%, l%)`. |
| History | New colors are stored and remain after reopening popup. |
| Remove history item | Removed color disappears and stays removed. |
| Tailwind tab | Nearest Tailwind color renders for selected color. |
| Compare tab | Contrast ratio and AA/AAA badges update. |
| Palette tab | Extraction runs only after clicking the feature control. |
| Keyboard shortcut | `Ctrl+Shift+X` / `Command+Shift+X` opens the extension action. |

## Release Notes

Use this for Chrome Web Store submission notes:

```text
PickPerfect 2.2.0 updates the extension package and refreshes the Chrome Web Store screenshots and promotional assets.
```

## Common Rejection Risks

| Risk | Mitigation |
| --- | --- |
| Permission justification unclear | Explain `activeTab` and `scripting` are only for user-triggered palette extraction. |
| Missing privacy policy | Add a hosted privacy policy URL before submission. |
| Misleading screenshots | Use current UI screenshots only. |
| Broad purpose | Keep wording focused on color picking and developer color workflows. |
| Payment confusion | Clearly mark premium features as optional one-time upgrade. |

## If Review Fails

1. Read the rejection reason carefully.
2. Fix only the specific issue called out.
3. Update the package or listing as needed.
4. Add a concise resubmission note explaining the fix.
5. Resubmit.

## Launch Content

### Reddit Draft

```markdown
**Title:** [Launch] PickPerfect - a color picker that does not break your React apps

Hey r/webdev!

I built PickPerfect after getting frustrated with color picker extensions that inject scripts, mutate the DOM, or make clipboard behavior unreliable.

**What it does:**

- Uses Chrome's native EyeDropper API
- Picks from the full screen, not only the browser
- Copies HEX, RGB, and HSL
- Keeps local color history
- Premium adds WCAG contrast checks, Tailwind matching, and page palette extraction

No tracking, no ads, minimal permissions, Manifest V3.

Chrome Web Store: [link]
```

### Product Hunt Draft

```markdown
**Tagline:** Color picker for developers that does not break your apps

PickPerfect is a Chrome color picker built around the native EyeDropper API, minimal permissions, and developer-focused color workflows.

It helps you pick colors from the full screen, copy them as HEX/RGB/HSL, check contrast, map colors to Tailwind, and extract page palettes on demand.

No tracking. No ads. No always-on content script for the core picker.

Demo video: https://youtu.be/17t8El4sDEI
```

### X / Twitter Draft

```text
I built PickPerfect because I wanted a color picker that did not inject random DOM changes into the apps I was debugging.

Native EyeDropper API.
HEX/RGB/HSL copy.
Local history.
WCAG contrast checks.
Tailwind color matching.
No tracking.

Chrome Web Store: [link]
```

## Post-Launch Monitoring

| Window | Watch |
| --- | --- |
| First 24 hours | Install count, reviews, rejection/approval status, payment issues |
| First week | Uninstall trend, bug reports, CWS rating, premium conversion |
| First month | Review quality, common feature requests, support load |

## Growth Experiments

- Add a landing page targeting "developer color picker Chrome extension".
- Publish a short technical article about using the EyeDropper API safely.
- Share Tailwind matching demos.
- Ask early users for reviews after the first successful workflow.
- Consider Edge Add-ons after Chrome Web Store validation.

## Final Gate

Submit only when all of these are true:

- [ ] `pickperfect.zip` exists
- [ ] `public/manifest.json` says `2.2.0`
- [ ] The built extension opens in Chrome
- [ ] Core picker and copy flow work
- [ ] Store screenshots match the current UI
- [ ] Privacy policy URL is ready
- [ ] Support contact is ready
