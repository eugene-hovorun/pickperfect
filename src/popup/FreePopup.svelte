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

  type Tab = 'color' | 'tailwind' | 'compare' | 'palette';

  // State
  let currentColor = $state<string | null>(null);
  let history = $state<ColorEntry[]>([]);
  let format = $state<ColorFormat>('hex');
  let copied = $state(false);
  let picking = $state(false);
  let error = $state<string | null>(null);
  let activeTab = $state<Tab>('color');

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
      activeTab = 'color'; // Switch to color tab after picking
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

<main class="flex flex-col h-full">
  <!-- Header (always visible) -->
  <header class="flex items-center justify-between p-4 pb-3">
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

  <!-- Pick Button (always visible) -->
  <div class="px-4 pb-3">
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

    {#if error}
      <div class="mt-2 px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
        {error}
      </div>
    {/if}
  </div>

  <!-- Tabs -->
  <div class="flex border-b border-border px-4">
    <button 
      class={cn(
        "px-3 py-2 text-xs font-medium transition-colors relative",
        activeTab === 'color' 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onclick={() => activeTab = 'color'}
    >
      Color
      {#if activeTab === 'color'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      {/if}
    </button>
    <button 
      class={cn(
        "px-3 py-2 text-xs font-medium transition-colors relative",
        activeTab === 'tailwind' 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onclick={() => activeTab = 'tailwind'}
    >
      Tailwind
      {#if activeTab === 'tailwind'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      {/if}
    </button>
    <button 
      class={cn(
        "px-3 py-2 text-xs font-medium transition-colors relative",
        activeTab === 'compare' 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onclick={() => activeTab = 'compare'}
    >
      Compare
      {#if activeTab === 'compare'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      {/if}
    </button>
    <button 
      class={cn(
        "px-3 py-2 text-xs font-medium transition-colors relative",
        activeTab === 'palette' 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onclick={() => activeTab = 'palette'}
    >
      Palette
      {#if activeTab === 'palette'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      {/if}
    </button>
  </div>

  <!-- Tab Content (scrollable) -->
  <div class="flex-1 overflow-y-auto p-4 pt-3" style="max-height: 400px;">
    {#if activeTab === 'color'}
      <div class="flex flex-col gap-3">
        {#if currentColor}
          <ColorSwatch
            color={currentColor}
            format={format}
            copied={copied}
            oncopy={() => handleCopy(formatColor(currentColor!, format))}
          />
        {/if}

        <HistoryGrid
          history={history}
          currentColor={currentColor}
          onselect={selectFromHistory}
          onremove={handleRemove}
          onclear={handleClearHistory}
        />

        {#if !currentColor && history.length === 0}
          <div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <p class="text-sm m-0">Pick your first color to get started</p>
            <span class="text-[11px] font-medium px-2 py-0.5 bg-muted rounded font-mono text-muted-foreground">
              Ctrl + Shift + C
            </span>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Upgrade Prompt for Premium Features -->
      <div class="flex flex-col items-center gap-4 py-8 px-4">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/50 to-orange-200/50 flex items-center justify-center text-2xl">
          {#if activeTab === 'tailwind'}
            🎨
          {:else if activeTab === 'compare'}
            ⚖️
          {:else if activeTab === 'palette'}
            🌈
          {/if}
        </div>
        
        <div class="text-center">
          <h3 class="text-sm font-semibold text-foreground mb-1">
            {#if activeTab === 'tailwind'}
              Tailwind Color Mapping
            {:else if activeTab === 'compare'}
              WCAG Contrast Checker
            {:else if activeTab === 'palette'}
              Page Palette Extraction
            {/if}
          </h3>
          <p class="text-xs text-muted-foreground">
            {#if activeTab === 'tailwind'}
              Find the nearest Tailwind CSS color instantly with match accuracy.
            {:else if activeTab === 'compare'}
              Compare two colors for accessibility compliance (AA/AAA).
            {:else if activeTab === 'palette'}
              Extract all colors from any webpage with one click.
            {/if}
          </p>
        </div>

        <div class="w-full bg-muted/50 rounded-lg p-3 border border-border">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-semibold px-2 py-1 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded-md tracking-wide">
              ✨ Premium
            </span>
            <span class="text-sm font-bold text-foreground">
              $2.99 once
            </span>
          </div>
          <button 
            class="w-full py-2.5 px-3.5 text-sm font-semibold text-white bg-gradient-to-br from-primary to-blue-700 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
            onclick={openUpgrade}
          >
            Upgrade to Premium
          </button>
        </div>

        <div class="text-center space-y-1">
          <p class="text-[10px] text-muted-foreground">All 3 premium features included:</p>
          <p class="text-[10px] text-muted-foreground">Tailwind • Compare • Palette</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <footer class="flex justify-center py-2 border-t border-border">
    <span class="text-[10px] text-muted-foreground opacity-60">
      Ctrl+Shift+C to open
    </span>
  </footer>
</main>