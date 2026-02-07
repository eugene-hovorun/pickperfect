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
  import HistoryGrid from './components/HistoryGrid.svelte';
  import ExtPay from 'extpay';

  // State
  let currentColor = $state<string | null>(null);
  let history = $state<ColorEntry[]>([]);
  let format = $state<ColorFormat>('hex');
  let copied = $state(false);
  let picking = $state(false);
  let error = $state<string | null>(null);

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

  function openUpgrade() {
    const extpay = ExtPay('pickperfect');
    extpay.openPaymentPage();
  }
</script>

<main>
  <!-- Header -->
  <header>
    <div class="logo">
      <img src="./icons/icon-48.png" alt="" width="18" height="18" />
      <span>PickPerfect</span>
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
  {#if currentColor}
    <ColorSwatch
      color={currentColor}
      format={format}
      copied={copied}
      oncopy={() => handleCopy(formatColor(currentColor!, format))}
    />
  {/if}

  <!-- Error -->
  {#if error}
    <div class="error-banner">{error}</div>
  {/if}

  <!-- History -->
  <HistoryGrid
    history={history}
    currentColor={currentColor}
    onselect={selectFromHistory}
    onremove={handleRemove}
    onclear={handleClearHistory}
  />

  <!-- Upgrade CTA -->
  <section class="upgrade-cta">
    <div class="upgrade-header">
      <span class="premium-badge">✨ Premium</span>
      <span class="price">pay $2.99 once</span>
    </div>
    <ul class="premium-features">
      <li>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>WCAG Contrast Checker</span>
      </li>
      <li>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Tailwind Color Mapping</span>
      </li>
      <li>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Page Palette Extraction</span>
      </li>
    </ul>
    <button class="upgrade-btn" onclick={openUpgrade}>
      Upgrade to Premium
    </button>
  </section>

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

  /* Upgrade CTA */
  .upgrade-cta {
    background: linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 100%);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .upgrade-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .premium-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    background: linear-gradient(135deg, #ffd90083 0%, #ffa60083 100%);
    color: #1D1D1F;
    border-radius: 6px;
    letter-spacing: 0.3px;
  }

  .price {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
  }

  .premium-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .premium-features li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text);
  }

  .premium-features svg {
    flex-shrink: 0;
    stroke: #34C759;
  }

  .upgrade-btn {
    width: 100%;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    background: linear-gradient(135deg, #0071E3 0%, #005BB5 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .upgrade-btn:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
  }

  .upgrade-btn:active {
    transform: translateY(0);
  }
</style>