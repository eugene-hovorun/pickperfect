// Shared color picker utilities - pure functions only
// State management stays in components using Svelte 5 runes

export const hasEyeDropper =
  typeof window !== "undefined" && "EyeDropper" in window;
export const formats = ["hex", "rgb", "hsl", "oklch"] as const;

/**
 * Opens EyeDropper and returns picked color hex
 * Handles both #RRGGBB and RGBA(r,g,b,a) formats from different Chrome versions
 */
export async function pickColorFromScreen(): Promise<string> {
  if (!hasEyeDropper) {
    throw new Error("EyeDropper API not available");
  }

  // @ts-ignore - EyeDropper API types not in default lib
  const dropper = new EyeDropper();
  const result = await dropper.open();
  const raw = result.sRGBHex;

  if (raw.startsWith("#")) {
    return raw.slice(0, 7).toUpperCase();
  } else {
    // Parse RGBA(r, g, b, a) or RGB(r, g, b)
    const nums = raw.match(/[\d.]+/g)?.map(Number) ?? [];
    const [r = 0, g = 0, b = 0] = nums;
    return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  }
}

/**
 * Copy text to clipboard with fallback for extension context
 */
export async function copyToClipboard(value: string): Promise<void> {
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // Fallback for clipboard API failure
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}
