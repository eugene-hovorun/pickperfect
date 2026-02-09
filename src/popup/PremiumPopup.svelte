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

<main class="p-4 flex flex-col gap-3">
  <!-- Header -->
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
      <img src="./icons/icon-48.png" alt="" width="18" height="18" />
      <span>PickPerfect</span>
      <span class="text-[9px] font-bold px-1.5 py-0.5 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded tracking-wider ml-1">
        ✨ PREMIUM
      </span>
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
    <div class="px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
      {error}
    </div>
  {/if}

  <!-- Contrast Checker -->
  {#if compareMode && selectedColors.length === 2}
    <ContrastChecker color1={selectedColors[0]} color2={selectedColors[1]} />
  {/if}

  <!-- History with Compare Toggle -->
  {#if history.length > 0}
    <section class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
          HISTORY
        </span>
        <div class="flex gap-2">
          <button 
            class={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded transition-all border",
              compareMode
                ? "text-primary-foreground bg-primary border-primary"
                : "text-muted-foreground bg-transparent border-border hover:text-primary hover:border-primary"
            )}
            onclick={toggleCompareMode}
            title="Compare two colors"
          >
            {compareMode ? 'Cancel' : 'Compare'}
          </button>
          <button 
            class="h-6 px-2 text-[11px] font-medium rounded transition-colors text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onclick={handleClearHistory}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-8 gap-1.5">
        {#each history as entry (entry.hex)}
          <button
            class={cn(
              "aspect-square rounded-lg cursor-pointer transition-all border-[1.5px]",
              !compareMode && currentColor === entry.hex && "border-primary shadow-[0_0_0_2px_hsl(var(--primary))] z-10",
              isSelected(entry.hex) && "border-amber-400 shadow-[0_0_0_2px_rgb(251,191,36)] z-10",
              !compareMode && currentColor !== entry.hex && !isSelected(entry.hex) && "border-border hover:scale-110 hover:shadow-md hover:z-10",
              compareMode && !isSelected(entry.hex) && "border-border hover:scale-110 hover:shadow-md hover:z-10"
            )}
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
        <p class="text-[11px] text-muted-foreground text-center m-0">
          Select two colors to compare their contrast ratio
        </p>
      {/if}
    </section>
  {/if}

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