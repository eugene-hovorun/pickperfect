<script lang="ts">
  import { formatColor, type ColorFormat } from '../lib/colors';
  import { hasEyeDropper, formats, pickColorFromScreen, copyToClipboard as copyText } from '../lib/useColorPicker';
  import {
    getHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getFormat,
    setFormat,
    type ColorEntry,
  } from '../lib/storage';
  import ColorSwatch from './components/ColorSwatch.svelte';
  import FormatPills from './components/FormatPills.svelte';
  import ContrastChecker from './components/ContrastChecker.svelte';
  import TailwindMatch from './components/TailwindMatch.svelte';
  import PaletteExtractor from './components/PaletteExtractor.svelte';

  // State
  let currentColor = $state<string | null>(null);
  let history = $state<ColorEntry[]>([]);
  let format = $state<ColorFormat>('hex');
  let copied = $state(false);
  let picking = $state(false);
  let error = $state<string | null>(null);

  // Contrast checker state
  let compareMode = $state(false);
  let selectedColors = $state<string[]>([]);

  // Initialize
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

  // Actions
  async function pickColor() {
    if (!hasEyeDropper || picking) return;
    picking = true;
    error = null;
    try {
      const hex = await pickColorFromScreen();
      currentColor = hex;
      history = await addToHistory(hex);
      await handleCopy(formatColor(hex, format));
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        error = 'Failed to pick color';
      }
    } finally {
      picking = false;
    }
  }

  async function handleCopy(value: string) {
    await copyText(value);
    copied = true;
    setTimeout(() => (copied = false), 1200);
  }

  async function selectFromHistory(hex: string) {
    currentColor = hex;
  }

  async function handleRemove(hex: string) {
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

  // Compare mode functions
  function toggleCompareMode() {
    compareMode = !compareMode;
    selectedColors = [];
  }

  function handleHistoryClick(hex: string) {
    if (!compareMode) {
      selectFromHistory(hex);
      return;
    }

    // In compare mode: select up to 2 colors
    if (selectedColors.includes(hex)) {
      selectedColors = selectedColors.filter(c => c !== hex);
    } else if (selectedColors.length < 2) {
      selectedColors = [...selectedColors, hex];
    } else {
      // Replace first color
      selectedColors = [selectedColors[1], hex];
    }
  }

  function isSelected(hex: string): boolean {
    return compareMode && selectedColors.includes(hex);
  }

  async function handlePaletteColorSelect(hex: string) {
    currentColor = hex;
    history = await addToHistory(hex);
    await handleCopy(formatColor(hex, format));
  }
</script>

<main>
  <!-- Header -->
  <header>
    <div class="logo">
      <img src="./icons/icon-48.png" alt="" width="18" height="18" />
      <span>PickPerfect</span>
      <span class="premium-badge">✨ PREMIUM</span>
    </div>
    <FormatPills 
      formats={formats} 
      current={format} 
      onswitch={switchFormat} 
    />
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
  {#if currentColor && !compareMode}
    <ColorSwatch
      color={currentColor}
      format={format}
      copied={copied}
      oncopy={() => handleCopy(formatColor(currentColor!, format))}
    />
  {/if}

  <!-- Tailwind Match -->
  {#if currentColor && !compareMode}
    <TailwindMatch color={currentColor} />
  {/if}

  <!-- Palette Extractor -->
  {#if !compareMode}
    <PaletteExtractor oncolorselect={handlePaletteColorSelect} />
  {/if}

  <!-- Error -->
  {#if error}
    <div class="error-banner">{error}</div>
  {/if}

  <!-- Contrast Checker -->
  {#if compareMode && selectedColors.length === 2}
    <ContrastChecker color1={selectedColors[0]} color2={selectedColors[1]} />
  {/if}

  <!-- History with Compare Toggle -->
  {#if history.length > 0}
    <section class="history">
      <div class="history-header">
        <span class="label">HISTORY</span>
        <div class="header-actions">
          <button 
            class="compare-btn" 
            class:active={compareMode}
            onclick={toggleCompareMode}
            title="Compare two colors"
          >
            {compareMode ? 'Cancel' : 'Compare'}
          </button>
          <button class="clear-btn" onclick={handleClearHistory}>Clear</button>
        </div>
      </div>
      <div class="history-grid">
        {#each history as entry (entry.hex)}
          <button
            class="history-swatch"
            class:selected={!compareMode && currentColor === entry.hex}
            class:compare-selected={isSelected(entry.hex)}
            style="background-color: {entry.hex};"
            onclick={() => handleHistoryClick(entry.hex)}
            oncontextmenu={(e) => { if (!compareMode) { e.preventDefault(); handleRemove(entry.hex); } }}
            title={compareMode 
              ? `Select for comparison (${selectedColors.length}/2)` 
              : `${entry.hex} — right-click to remove`}
          ></button>
        {/each}
      </div>
      {#if compareMode}
        <p class="compare-hint">Select two colors to compare their contrast ratio</p>
      {/if}
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
    --premium: #FFD700;

    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

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

  .premium-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    background: linear-gradient(135deg, #ffd90083 0%, #ffa60083 100%);
    color: #1D1D1F;
    border-radius: 4px;
    letter-spacing: 0.5px;
    margin-left: 4px;
  }

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

  .error-banner {
    padding: 10px 12px;
    font-size: 12px;
    color: #FF3B30;
    background: rgba(255, 59, 48, 0.08);
    border-radius: 8px;
    text-align: center;
  }

  /* History with Compare Mode */
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

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .compare-btn {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    background: none;
    border: 1px solid var(--border);
    cursor: pointer;
    padding: 3px 8px;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .compare-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .compare-btn.active {
    color: #FFFFFF;
    background: var(--accent);
    border-color: var(--accent);
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

  .history-swatch.compare-selected {
    border-color: var(--premium);
    box-shadow: 0 0 0 2px var(--premium);
  }

  .compare-hint {
    font-size: 11px;
    color: var(--text-secondary);
    text-align: center;
    margin: 0;
  }

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