<script lang="ts">
  import { formatColor, type ColorFormat } from '$lib/colors';
  import { hasEyeDropper, formats, pickColorFromScreen, copyToClipboard as copyText } from '$lib/useColorPicker';
  import {
    getHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getFormat,
    setFormat,
    type ColorEntry,
  } from '$lib/storage';
  import { cn } from '$lib/utils';
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

<main class="p-4 flex flex-col gap-3">
  <!-- Header -->
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
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
    <button 
      class={cn(
        "flex items-center justify-center gap-2 w-full py-3 px-4",
        "text-sm font-semibold text-primary-foreground rounded-xl transition-all",
        "bg-primary hover:bg-primary/90",
        picking 
          ? "opacity-70 cursor-wait" 
          : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
      )}
      onclick={pickColor} 
      disabled={picking}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-white">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
      </svg>
      {picking ? 'Picking…' : 'Pick a Color'}
    </button>
  {:else}
    <div class="px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
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
    <div class="px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
      {error}
    </div>
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
  <section class="bg-gradient-to-br from-muted to-background border-[1.5px] border-border rounded-xl p-3.5 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-semibold px-2 py-1 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded-md tracking-wide">
        ✨ Premium
      </span>
      <span class="text-sm font-bold text-foreground">
        pay $2.99 once
      </span>
    </div>
    
    <ul class="list-none flex flex-col gap-2">
      <li class="flex items-center gap-2 text-xs text-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="flex-shrink-0 stroke-green-600">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>WCAG Contrast Checker</span>
      </li>
      <li class="flex items-center gap-2 text-xs text-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="flex-shrink-0 stroke-green-600">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Tailwind Color Mapping</span>
      </li>
      <li class="flex items-center gap-2 text-xs text-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="flex-shrink-0 stroke-green-600">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Page Palette Extraction</span>
      </li>
    </ul>
    
    <button 
      class="w-full py-2.5 px-3.5 text-sm font-semibold text-white bg-gradient-to-br from-primary to-blue-700 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
      onclick={openUpgrade}
    >
      Upgrade to Premium
    </button>
  </section>

  <!-- Empty State -->
  {#if !currentColor && history.length === 0}
    <div class="flex flex-col items-center gap-2 py-6 px-4 text-muted-foreground">
      <p class="text-sm m-0">Pick your first color to get started</p>
      <span class="text-[11px] font-medium px-2 py-0.5 bg-muted rounded font-mono text-muted-foreground">
        Ctrl + Shift + C
      </span>
    </div>
  {/if}

  <!-- Footer -->
  <footer class="flex justify-center pt-1">
    <span class="text-[10px] text-muted-foreground opacity-60">
      Ctrl+Shift+C to open
    </span>
  </footer>
</main>