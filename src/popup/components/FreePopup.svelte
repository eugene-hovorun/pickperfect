<script lang="ts">
  import { formatColor, luminance, type ColorFormat } from '../../lib/colors';
  import {
    getHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getFormat,
    setFormat,
    type ColorEntry,
  } from '../../lib/storage';

  // --- State ---
  let currentColor = $state<string | null>(null);
  let history = $state<ColorEntry[]>([]);
  let format = $state<ColorFormat>('hex');
  let copied = $state(false);
  let picking = $state(false);
  let error = $state<string | null>(null);

  const hasEyeDropper = 'EyeDropper' in window;
  const formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];

  let displayValue = $derived(currentColor ? formatColor(currentColor, format) : '');
  let textOnSwatch = $derived(currentColor && luminance(currentColor) > 0.6 ? '#1D1D1F' : '#FFFFFF');

  // --- Init ---
  $effect(() => {
    (async () => {
      history = await getHistory();
      const savedFormat = await getFormat();
      if (formats.includes(savedFormat as ColorFormat)) {
        format = savedFormat as ColorFormat;
      }
      if (!currentColor && history.length > 0) {
        currentColor = history[0].hex;
      }
    })();
  });

  // --- Actions ---
  async function pickColor() {
    if (!hasEyeDropper || picking) return;
    picking = true;
    error = null;
    try {
      // @ts-ignore - EyeDropper API types not in default lib
      const dropper = new EyeDropper();
      const result = await dropper.open();
      const raw = result.sRGBHex;
      let hex: string;
      if (raw.startsWith('#')) {
        hex = raw.slice(0, 7).toUpperCase();
      } else {
        // Parse RGBA(r, g, b, a) or RGB(r, g, b)
        const nums = raw.match(/[\d.]+/g)?.map(Number) ?? [];
        const [r = 0, g = 0, b = 0] = nums;
        hex = `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
      }
      currentColor = hex;
      history = await addToHistory(hex);
      await copyToClipboard(hex);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        error = 'Failed to pick color';
      }
    } finally {
      picking = false;
    }
  }

  async function copyToClipboard(hex?: string) {
    const value = hex ? formatColor(hex, format) : displayValue;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    } catch {
      // Fallback for clipboard API failure
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    }
  }

  async function selectFromHistory(hex: string) {
    currentColor = hex;
    await copyToClipboard(hex);
  }

  async function handleRemove(e: MouseEvent, hex: string) {
    e.preventDefault();
    history = await removeFromHistory(hex);
    if (currentColor === hex) {
      currentColor = history.length > 0 ? history[0].hex : null;
    }
  }

  async function handleClearHistory() {
    await clearHistory();
    history = [];
    currentColor = null;
  }

  async function switchFormat(f: ColorFormat) {
    format = f;
    await setFormat(f);
  }
</script>

<main>
  <!-- Header -->
  <header>
    <div class="logo">
      <img src="./icons/icon-48.png" alt="" width="18" height="18" />
      <span>PickPerfect</span>
    </div>
    <div class="format-pills">
      {#each formats as f}
        <button
          class="pill"
          class:active={format === f}
          onclick={() => switchFormat(f)}
        >
          {f.toUpperCase()}
        </button>
      {/each}
    </div>
  </header>

  <!-- Pick Button -->
  {#if hasEyeDropper}
    <button class="pick-btn" onclick={pickColor} disabled={picking}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
      </svg>
      {picking ? 'Picking…' : 'Pick a Color'}
    </button>
  {:else}
    <div class="error-banner">
      EyeDropper API not available. Please use Chrome 95+.
    </div>
  {/if}

  <!-- Color Preview -->
  {#if currentColor}
    <button
      class="swatch-card"
      style="background-color: {currentColor};"
      onclick={() => copyToClipboard()}
      title="Click to copy"
    >
      <span class="swatch-value" style="color: {textOnSwatch};">
        {#if copied}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        {:else}
          {displayValue}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        {/if}
      </span>
    </button>
  {/if}

  <!-- Error -->
  {#if error}
    <div class="error-banner">{error}</div>
  {/if}

  <!-- History -->
  {#if history.length > 0}
    <section class="history">
      <div class="history-header">
        <span class="label">HISTORY</span>
        <button class="clear-btn" onclick={handleClearHistory}>Clear</button>
      </div>
      <div class="history-grid">
        {#each history as entry (entry.hex)}
          <button
            class="history-swatch"
            class:selected={currentColor === entry.hex}
            style="background-color: {entry.hex};"
            onclick={() => selectFromHistory(entry.hex)}
            oncontextmenu={(e) => handleRemove(e, entry.hex)}
            title="{entry.hex} — right-click to remove"
          ></button>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Empty State -->
  {#if !currentColor && history.length === 0}
    <div class="empty">
      <p>Pick your first color to get started</p>
      <span class="shortcut">Ctrl + Shift + C</span>
    </div>
  {/if}

  <!-- Footer -->
  <footer>
    <span class="shortcut-hint">Ctrl+Shift+C to open</span>
  </footer>
</main>

<style>
  main {
    --bg: #FFFFFF;
    --bg-subtle: #F5F5F7;
    --border: #E5E5EA;
    --text: #1D1D1F;
    --text-secondary: #86868B;
    --accent: #0071E3;
    --accent-hover: #0077ED;
    --success: #34C759;

    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Header */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }

  .format-pills {
    display: flex;
    gap: 2px;
    background: var(--bg-subtle);
    border-radius: 8px;
    padding: 2px;
  }

  .pill {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.3px;
  }

  .pill:hover {
    color: var(--text);
  }

  .pill.active {
    background: #FFFFFF;
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  /* Pick Button */
  .pick-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pick-btn:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-0.5px);
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
  }

  .pick-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .pick-btn:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  .pick-btn svg {
    stroke: #FFFFFF;
  }

  /* Swatch Card */
  .swatch-card {
    width: 100%;
    height: 80px;
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    font-family: inherit;
  }

  .swatch-card:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .swatch-card:active {
    transform: translateY(0);
  }

  .swatch-value {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .copy-icon {
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .swatch-card:hover .copy-icon {
    opacity: 0.7;
  }

  /* History */
  .history {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
  }

  .clear-btn {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .clear-btn:hover {
    color: #FF3B30;
    background: rgba(255, 59, 48, 0.08);
  }

  .history-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
  }

  .history-swatch {
    aspect-ratio: 1;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }

  .history-swatch:hover {
    transform: scale(1.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  .history-swatch.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
  }

  /* Error Banner */
  .error-banner {
    padding: 10px 12px;
    font-size: 12px;
    color: #FF3B30;
    background: rgba(255, 59, 48, 0.08);
    border-radius: 8px;
    text-align: center;
  }

  /* Empty State */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 16px;
    color: var(--text-secondary);
  }

  .empty p {
    font-size: 13px;
  }

  .shortcut {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 8px;
    background: var(--bg-subtle);
    border-radius: 4px;
    color: var(--text-secondary);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
  }

  /* Footer */
  footer {
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }

  .shortcut-hint {
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0.6;
  }
</style>