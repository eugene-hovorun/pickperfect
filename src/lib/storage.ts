export interface ColorEntry {
  hex: string;
  timestamp: number;
}

const HISTORY_KEY = "pp_history";
const FORMAT_KEY = "pp_format";
const MAX_HISTORY = 20;

type HistoryStorage = {
  [HISTORY_KEY]?: ColorEntry[];
};

type FormatStorage = {
  [FORMAT_KEY]?: string;
};

function store(): typeof chrome.storage.local | null {
  try {
    return chrome?.storage?.local ?? null;
  } catch {
    return null;
  }
}

export async function getHistory(): Promise<ColorEntry[]> {
  const s = store();
  if (!s) return [];

  const result = (await s.get(HISTORY_KEY)) as HistoryStorage;
  return Array.isArray(result[HISTORY_KEY]) ? result[HISTORY_KEY] : [];
}

export async function addToHistory(hex: string): Promise<ColorEntry[]> {
  const history = await getHistory();
  const normalized = hex.toUpperCase();

  const filtered = history.filter((h) => h.hex !== normalized);
  const updated: ColorEntry[] = [
    { hex: normalized, timestamp: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY);

  const s = store();
  if (s) {
    await s.set({ [HISTORY_KEY]: updated } as HistoryStorage);
  }

  return updated;
}

export async function removeFromHistory(hex: string): Promise<ColorEntry[]> {
  const history = await getHistory();
  const updated = history.filter((h) => h.hex !== hex.toUpperCase());

  const s = store();
  if (s) {
    await s.set({ [HISTORY_KEY]: updated } as HistoryStorage);
  }

  return updated;
}

export async function clearHistory(): Promise<void> {
  const s = store();
  if (s) await s.remove(HISTORY_KEY);
}

export async function getFormat(): Promise<string> {
  const s = store();
  if (!s) return "hex";

  const result = (await s.get(FORMAT_KEY)) as FormatStorage;
  return typeof result[FORMAT_KEY] === "string" ? result[FORMAT_KEY] : "hex";
}

export async function setFormat(format: string): Promise<void> {
  const s = store();
  if (s) {
    await s.set({ [FORMAT_KEY]: format } as FormatStorage);
  }
}
