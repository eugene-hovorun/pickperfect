<script lang="ts">
  import { extractPaletteFromPage, groupSimilarColors, type ExtractedColor } from '$lib/paletteExtractor';
  import { luminance } from '$lib/colors';
  import { cn } from '$lib/utils';

  interface Props {
    oncolorselect: (hex: string) => void;
  }

  let { oncolorselect }: Props = $props();

  let palette = $state<ExtractedColor[]>([]);
  let extracting = $state(false);
  let error = $state<string | null>(null);
  let groupSimilar = $state(true);

  async function extractPalette() {
    extracting = true;
    error = null;
    palette = [];

    try {
      let colors = await extractPaletteFromPage();
      
      if (groupSimilar) {
        colors = groupSimilarColors(colors, 30);
      }
      
      palette = colors;
      
      if (colors.length === 0) {
        error = 'No colors found on this page';
      }
    } catch (e: any) {
      error = e.message || 'Failed to extract colors';
    } finally {
      extracting = false;
    }
  }

  function getTypeIcon(type: ExtractedColor['type']): string {
    switch (type) {
      case 'background': return '🎨';
      case 'text': return '📝';
      case 'border': return '🔲';
      case 'mixed': return '✨';
    }
  }

  function getTypeLabel(type: ExtractedColor['type']): string {
    switch (type) {
      case 'background': return 'Background';
      case 'text': return 'Text';
      case 'border': return 'Border';
      case 'mixed': return 'Mixed';
    }
  }
</script>

<section class="bg-muted/50 rounded-xl p-3 flex flex-col gap-3">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
      PAGE PALETTE
    </span>
    <label class="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
      <input type="checkbox" bind:checked={groupSimilar} class="cursor-pointer" />
      <span>Group similar</span>
    </label>
  </div>

  <!-- Initial Extract Button -->
  {#if palette.length === 0 && !error}
    <button 
      class={cn(
        "flex items-center justify-center gap-2 w-full py-2.5 px-3.5",
        "text-sm font-semibold text-primary-foreground rounded-lg transition-all",
        "bg-primary hover:bg-primary/90",
        extracting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
      )}
      onclick={extractPalette} 
      disabled={extracting}
    >
      {#if extracting}
        <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Extracting...
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 3v18"/>
          <path d="M15 3v18"/>
          <path d="M3 9h18"/>
          <path d="M3 15h18"/>
        </svg>
        Extract Colors from Page
      {/if}
    </button>
    <p class="text-[11px] text-muted-foreground text-center m-0">
      Extract all colors from the active tab
    </p>
  {/if}

  <!-- Error State -->
  {#if error}
    <div class="px-2.5 py-2 text-xs text-destructive bg-destructive/10 rounded-md text-center">
      {error}
    </div>
    <button 
      class="px-3 py-1.5 text-xs font-medium text-primary bg-transparent border border-border rounded-md transition-colors hover:border-primary hover:bg-primary/5"
      onclick={extractPalette}
    >
      Try Again
    </button>
  {/if}

  <!-- Palette Display -->
  {#if palette.length > 0}
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-medium text-foreground">
        {palette.length} colors found
      </span>
      <button 
        class="h-6 px-2 text-[11px] font-medium rounded-md transition-colors text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onclick={() => palette = []}
      >
        Clear
      </button>
    </div>

    <!-- Palette Grid -->
    <div class="grid grid-cols-4 gap-2">
      {#each palette as color (color.hex)}
        <button
          class="aspect-square border-[1.5px] border-border rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-md hover:z-10 flex flex-col items-center justify-center gap-0.5 p-1"
          style="background-color: {color.hex};"
          onclick={() => oncolorselect(color.hex)}
          title="{color.hex} • {getTypeLabel(color.type)} • {color.count} uses"
        >
          <span class="text-xs opacity-80">{getTypeIcon(color.type)}</span>
          <span 
            class="text-[9px] font-semibold tracking-tight"
            style="color: {luminance(color.hex) > 0.6 ? '#1D1D1F' : '#FFFFFF'}; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);"
          >
            {color.hex}
          </span>
        </button>
      {/each}
    </div>

    <!-- Extract Again Button -->
    <button 
      class={cn(
        "flex items-center justify-center gap-2 w-full py-2.5 px-3.5",
        "text-sm font-semibold rounded-lg transition-all border",
        "bg-background text-primary border-border",
        extracting 
          ? "opacity-70 cursor-not-allowed" 
          : "hover:bg-muted hover:border-primary"
      )}
      onclick={extractPalette} 
      disabled={extracting}
    >
      {extracting ? 'Extracting...' : 'Extract Again'}
    </button>
  {/if}
</section>