# PickPerfect — Project Spec & Guide

## Context for AI Assistant

This document captures all research, decisions, and implementation details for the PickPerfect Chrome extension. Use it as the single source of truth. The developer (Eugene) prefers to delegate implementation to AI — keep the codebase small enough to fit in one prompt (~800 lines max per repo).

---

## What We're Building

A modern, trustworthy, developer-focused color picker Chrome extension with a freemium model ($2–3 one-time for premium). The goal is passive side income.

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

- Uses native `EyeDropper` API — zero DOM injection, can't break other apps
- Clipboard that actually works, every time
- Clean modern UI (CSS Peeper level quality)
- Minimal permissions, transparent privacy
- Tailwind/CSS variables/design tokens export (premium)
- Contrast ratio checker (premium)

---

## Decisions — Locked In

### Naming & Branding

- **Name:** PickPerfect
- **Store title:** "PickPerfect — Color Picker for Developers"
- **Tagline:** "Pick colors. Copy instantly. Zero bloat."
- **Domain (later):** pickperfect.dev
- **Icon:** Custom crosshair/target SVG with blue gradient (`icon-source.svg`)

### UI Theme & Design System

- **Theme:** Light only (neutral backdrop makes picked colors pop)
- **Philosophy:** UI should feel invisible — showcase user's colors, not its own

| Token              | Value     | Usage                      |
| ------------------ | --------- | -------------------------- |
| `--bg`             | `#FFFFFF` | Main background            |
| `--bg-subtle`      | `#F5F5F7` | Cards, history, sections   |
| `--border`         | `#E5E5EA` | Dividers, input borders    |
| `--text`           | `#1D1D1F` | Primary text               |
| `--text-secondary` | `#86868B` | Labels, hints              |
| `--accent`         | `#0071E3` | Buttons, active states     |
| `--accent-hover`   | `#0077ED` | Button hover               |
| `--success`        | `#34C759` | "Copied!" feedback         |

- **Typography:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`)
- **Spacing:** 4px base grid
- **Popup:** 360px wide, 16px padding
- **Border radius:** 12px cards, 10px buttons, 8px pills/swatches

### Technical Stack

- **Svelte 5** with runes (reactivity via `$state`, `$derived`, `$effect`)
- **Vite 6** with multi-entry build (popup + background)
- **TypeScript**
- **Chrome Manifest V3**
- **Native `EyeDropper` API** (Chrome 95+)

### Keyboard Shortcut

- **Default:** `Ctrl+Shift+C` (not Alt+Shift — conflicts with Linux keyboard layout switching)
- Configured via `_execute_action` in manifest (opens popup)
- Users can rebind at `chrome://extensions/shortcuts`

### History

- **Max 20 colors** in free tier
- Persisted in `chrome.storage.local`
- Deduplicates on re-pick (moves color to front)
- Right-click to remove individual colors

---

## Feature Spec

### Free Tier (v1.0 — current)

- Eyedropper via native `EyeDropper` API (Chrome 95+)
- One-click copy in HEX, RGB, HSL (format persisted)
- Color history (up to 20 colors, persisted)
- Keyboard shortcut to open popup (`Ctrl+Shift+C`)
- Clean, modern popup UI
- Zero content scripts, zero DOM injection
- Minimal permissions (only `storage`)

### Premium Tier ($2–3 one-time via ExtensionPay) — LATER

- Full page palette extraction with color grouping
- Export as: Tailwind config, CSS variables, SCSS variables, JSON design tokens
- "Nearest Tailwind color" mapping for any picked color
- Contrast ratio checker (WCAG AA/AAA) for any two colors
- Palette collections — save/name palettes per project
- Pick colors from uploaded images

---

## Known Technical Quirks

### EyeDropper API returns RGBA strings on some Linux/Chrome versions

The spec says `sRGBHex` returns `#RRGGBB`, but some Chrome versions on Linux return `RGBA(r, g, b, a)` instead. The `pickColor()` function handles both formats — parses RGBA strings and converts to hex.

### Clipboard fallback

Primary: `navigator.clipboard.writeText()`. Fallback: hidden textarea + `document.execCommand('copy')` for edge cases where clipboard API fails in extension context.

---

## File Structure

```
pickperfect/
  src/
    popup/App.svelte        ← Entire popup UI (~300 lines)
    popup/main.ts           ← Mount point (3 lines)
    background/index.ts     ← Service worker (minimal)
    lib/colors.ts           ← HEX ↔ RGB ↔ HSL + luminance (~80 lines)
    lib/storage.ts          ← chrome.storage.local wrapper (~60 lines)
  public/
    manifest.json           ← Manifest V3
    icons/                  ← 16, 48, 128px PNGs
  icon-source.svg           ← Source icon for regeneration
  popup.html                ← Popup entry point
  preview.html              ← Standalone UI preview (not shipped)
  vite.config.ts
  package.json
  .gitignore
  README.md
  GUIDE.md                  ← This file
```

**Total source lines:** ~640 (well within 800 budget)

---

## Architecture

Two **separate, small repos**. No monorepo.

### Repo 1: `pickperfect/` (this repo)

Chrome extension. Svelte + Vite + TypeScript.

### Repo 2: `pickperfect-landing/` (later)

Single HTML file with inline CSS/JS. Marketing page with hero, features, FAQ, Chrome Web Store link. Deploy to Netlify/Vercel.

---

## Monetization (later)

- **Payment provider:** ExtensionPay
- **Model:** Freemium — free core, $2–3 one-time for premium
- **Integration:** `ExtPay('pickperfect')` → `extpay.getUser().then(user => user.paid)`

---

## Distribution Plan (in priority order)

1. Chrome Web Store listing (good title, description, screenshots)
2. Reddit posts (r/webdev, r/frontend, r/chrome, r/design)
3. Product Hunt launch
4. Landing page with SEO (target: "best color picker chrome extension 2026", "tailwind color picker chrome")

---

## Key Principles

- **Ship in one weekend.** Free version live on Chrome Web Store first. Premium and landing page come later.
- **Small codebase.** Every file must earn its place. If an LLM can't process the whole repo in one prompt, it's too big.
- **Don't break user's apps.** No content scripts, no DOM injection. This is a real differentiator.
- **Clipboard must work.** #1 complaint about every competitor. Fallback in place.
- **Trust is a feature.** Minimal permissions, clear privacy stance, no ads, no tracking.
