export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

export interface Oklch {
  L: number;
  C: number;
  H: number;
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  if (clean.length < 6 || !/^[0-9A-Fa-f]+$/.test(clean)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** Convert sRGB 0-255 channel to linear */
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Convert RGB (0-255) to Oklab.
 * Based on Björn Ottosson's reference implementation.
 */
export function rgbToOklab(r: number, g: number, b: number): Oklab {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_cbrt = Math.cbrt(l_);
  const m_cbrt = Math.cbrt(m_);
  const s_cbrt = Math.cbrt(s_);

  return {
    L: 0.2104542553 * l_cbrt + 0.793617785 * m_cbrt - 0.0040720468 * s_cbrt,
    a: 1.9779984951 * l_cbrt - 2.428592205 * m_cbrt + 0.4505937099 * s_cbrt,
    b: 0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.808675766 * s_cbrt,
  };
}

/** Convert RGB (0-255) to Oklch (polar form of Oklab) */
export function rgbToOklch(r: number, g: number, b: number): Oklch {
  const lab = rgbToOklab(r, g, b);
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L: lab.L, C, H };
}

export function formatColor(hex: string, format: ColorFormat): string {
  const upper = hex.toUpperCase();
  switch (format) {
    case "hex":
      return upper;
    case "rgb": {
      const { r, g, b } = hexToRgb(hex);
      return `rgb(${r}, ${g}, ${b})`;
    }
    case "hsl": {
      const { r, g, b } = hexToRgb(hex);
      const { h, s, l } = rgbToHsl(r, g, b);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case "oklch": {
      const { r, g, b } = hexToRgb(hex);
      const { L, C, H } = rgbToOklch(r, g, b);
      return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`;
    }
  }
}

/** Returns perceived luminance 0-1, useful for deciding text color on a swatch */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Returns relative luminance (WCAG formula) 0-1 for contrast calculations */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Returns WCAG contrast ratio between two colors (1-21) */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface WCAGCompliance {
  ratio: number;
  aaLarge: boolean; // 3:1
  aaaLarge: boolean; // 4.5:1
  aaNormal: boolean; // 4.5:1
  aaaNormal: boolean; // 7:1
}

/** Returns WCAG compliance info for two colors */
export function checkContrast(hex1: string, hex2: string): WCAGCompliance {
  const ratio = contrastRatio(hex1, hex2);
  return {
    ratio,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
  };
}

/** Calculate Euclidean distance between two colors in RGB space */
export function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export interface NearestColor {
  name: string;
  hex: string;
  distance: number;
}

/** Find the nearest color from a list of named colors */
export function findNearestColor(
  targetHex: string,
  colorList: Array<{ name: string; hex: string }>,
): NearestColor {
  let nearest = colorList[0];
  let minDistance = colorDistance(targetHex, nearest.hex);

  for (let i = 1; i < colorList.length; i++) {
    const dist = colorDistance(targetHex, colorList[i].hex);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = colorList[i];
    }
  }

  return {
    name: nearest.name,
    hex: nearest.hex,
    distance: minDistance,
  };
}
