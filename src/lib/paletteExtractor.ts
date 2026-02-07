/**
 * On-demand palette extraction from active tab
 * Uses chrome.scripting.executeScript - no persistent content scripts
 */

export interface ExtractedColor {
  hex: string;
  count: number; // Number of elements using this color
  type: "background" | "text" | "border" | "mixed";
}

/**
 * Extract colors from the active tab's DOM
 * Requires permissions: ["activeTab", "scripting"]
 */
export async function extractPaletteFromPage(): Promise<ExtractedColor[]> {
  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) {
    throw new Error("No active tab found");
  }

  // Inject extraction script into the page
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractColorsFromDOM,
  });

  if (!result.result) {
    throw new Error("Failed to extract colors from page");
  }

  return result.result;
}

/**
 * This function runs in the page context (not in extension context)
 * It extracts all colors from computed styles
 */
function extractColorsFromDOM(): ExtractedColor[] {
  const colorMap = new Map<string, { count: number; types: Set<string> }>();

  // Helper to convert rgb/rgba to hex
  function rgbToHex(rgb: string): string | null {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return null;

    const [r, g, b, a] = match.map(Number);

    // Skip fully transparent colors
    if (a !== undefined && a === 0) return null;

    const hex = [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    return `#${hex}`;
  }

  // Extract colors from all visible elements
  const elements = document.querySelectorAll("*");

  elements.forEach((el) => {
    // Skip hidden elements
    if ((el as HTMLElement).offsetParent === null) return;

    const computed = getComputedStyle(el);

    // Background color
    const bg = computed.backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const hex = rgbToHex(bg);
      if (hex) {
        const existing = colorMap.get(hex) || { count: 0, types: new Set() };
        existing.count++;
        existing.types.add("background");
        colorMap.set(hex, existing);
      }
    }

    // Text color
    const text = computed.color;
    if (text && text !== "rgba(0, 0, 0, 0)" && text !== "transparent") {
      const hex = rgbToHex(text);
      if (hex) {
        const existing = colorMap.get(hex) || { count: 0, types: new Set() };
        existing.count++;
        existing.types.add("text");
        colorMap.set(hex, existing);
      }
    }

    // Border color
    const border = computed.borderColor;
    if (border && border !== "rgba(0, 0, 0, 0)" && border !== "transparent") {
      const hex = rgbToHex(border);
      if (hex) {
        const existing = colorMap.get(hex) || { count: 0, types: new Set() };
        existing.count++;
        existing.types.add("border");
        colorMap.set(hex, existing);
      }
    }
  });

  // Convert map to array and determine primary type
  const colors: ExtractedColor[] = Array.from(colorMap.entries()).map(
    ([hex, data]) => {
      let type: ExtractedColor["type"] = "mixed";
      if (data.types.size === 1) {
        type = Array.from(data.types)[0] as ExtractedColor["type"];
      }

      return {
        hex,
        count: data.count,
        type,
      };
    },
  );

  // Sort by frequency (most common first)
  colors.sort((a, b) => b.count - a.count);

  // Return top 24 colors (fits nicely in a grid)
  return colors.slice(0, 24);
}

/**
 * Group similar colors together
 * Useful for reducing palette to distinct colors
 */
export function groupSimilarColors(
  colors: ExtractedColor[],
  threshold: number = 30,
): ExtractedColor[] {
  const grouped: ExtractedColor[] = [];

  for (const color of colors) {
    // Check if similar color already exists in grouped array
    let found = false;

    for (const existing of grouped) {
      if (colorDistance(color.hex, existing.hex) < threshold) {
        // Merge into existing group (add counts)
        existing.count += color.count;
        found = true;
        break;
      }
    }

    if (!found) {
      grouped.push({ ...color });
    }
  }

  // Re-sort by count after grouping
  grouped.sort((a, b) => b.count - a.count);

  return grouped;
}

/** Simple RGB distance for grouping */
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}
