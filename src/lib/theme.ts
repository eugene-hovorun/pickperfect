export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getSystemPreference(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemPreference() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export async function getTheme(): Promise<Theme> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const saved = result[STORAGE_KEY];
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {}
  return "system";
}

export async function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: theme });
  } catch {}
}

/** Call once before mounting the app to avoid flash of wrong theme */
export async function initTheme() {
  const theme = await getTheme();
  applyTheme(theme);

  // Listen for system preference changes when using 'system' mode
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", async () => {
      const current = await getTheme();
      if (current === "system") {
        applyTheme("system");
      }
    });

  return theme;
}
