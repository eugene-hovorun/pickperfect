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
  import Header from './components/Header.svelte';
  import PickButton from './components/PickButton.svelte';
  import Tabs from './components/Tabs.svelte';
  import ColorTab from './components/ColorTab.svelte';
  import CompareTab from './components/CompareTab.svelte';
  import TailwindMatch from './components/TailwindMatch.svelte';
  import PaletteExtractor from './components/PaletteExtractor.svelte';

  type Tab = 'color' | 'tailwind' | 'compare' | 'palette';

  // State
  let currentColor = $state<string | null>(null);
  let history = $state<ColorEntry[]>([]);
  let format = $state<ColorFormat>('hex');
  let copied = $state(false);
  let picking = $state(false);
  let error = $state<string | null>(null);
  let activeTab = $state<Tab>('color');
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
      activeTab = 'color';
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

  function handleCompareSelect(hex: string) {
    if (selectedColors.includes(hex)) {
      selectedColors = selectedColors.filter(c => c !== hex);
    } else if (selectedColors.length < 2) {
      selectedColors = [...selectedColors, hex];
    } else {
      selectedColors = [selectedColors[1], hex];
    }
  }

  async function handlePaletteColorSelect(hex: string) {
    currentColor = hex;
    history = await addToHistory(hex);
    await handleCopy(formatColor(hex, format));
    activeTab = 'color';
  }

  // Reset selected colors when switching tabs
  $effect(() => {
    if (activeTab !== 'compare') {
      selectedColors = [];
    }
  });
</script>

<main class="flex flex-col h-full">
  <Header 
    formats={formats} 
    currentFormat={format} 
    onformatchange={switchFormat}
    isPremium={true}
  />

  <PickButton 
    picking={picking}
    hasEyeDropper={hasEyeDropper}
    error={error}
    onpick={pickColor}
  />

  <Tabs activeTab={activeTab} onchange={(tab) => activeTab = tab} />

  <div class="flex-1 overflow-y-auto p-4 pt-3" style="max-height: 400px;">
    {#if activeTab === 'color'}
      <ColorTab 
        currentColor={currentColor}
        history={history}
        format={format}
        copied={copied}
        oncopy={() => handleCopy(formatColor(currentColor!, format))}
        onselect={selectFromHistory}
        onremove={handleRemove}
        onclear={handleClearHistory}
      />
    {:else if activeTab === 'tailwind'}
      {#if currentColor}
        <TailwindMatch color={currentColor} />
      {:else}
        <div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <p class="text-sm m-0">Pick a color to see Tailwind matches</p>
        </div>
      {/if}
    {:else if activeTab === 'compare'}
      <CompareTab 
        history={history}
        selectedColors={selectedColors}
        onselect={handleCompareSelect}
      />
    {:else if activeTab === 'palette'}
      <PaletteExtractor oncolorselect={handlePaletteColorSelect} />
    {/if}
  </div>

  <footer class="flex justify-center py-2 border-t border-border">
    <span class="text-[10px] text-muted-foreground opacity-60">
      Ctrl+Shift+C to open
    </span>
  </footer>
</main>