export type ColorFormat = "hex" | "rgb" | "hsl";

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
