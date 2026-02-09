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
  import UpgradePrompt from './components/UpgradePrompt.svelte';
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

  function openUpgrade() {
    const extpay = ExtPay('pickperfect');
    extpay.openPaymentPage();
  }
</script>

<main class="flex flex-col h-full">
  <Header 
    formats={formats} 
    currentFormat={format} 
    onformatchange={switchFormat}
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
    {:else}
      <UpgradePrompt tab={activeTab} onupgrade={openUpgrade} />
    {/if}
  </div>

  <footer class="flex justify-center py-2 border-t border-border">
    <span class="text-[10px] text-muted-foreground opacity-60">
      Ctrl+Shift+C to open
    </span>
  </footer>
</main>