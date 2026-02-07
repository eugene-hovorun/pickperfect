<script lang="ts">
  import { extractPaletteFromPage, groupSimilarColors, type ExtractedColor } from '../../lib/paletteExtractor';
  import { luminance } from '../../lib/colors';

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

<section class="palette-extractor">
  <div class="extractor-header">
    <span class="label">PAGE PALETTE</span>
    <label class="group-toggle">
      <input type="checkbox" bind:checked={groupSimilar} />
      <span>Group similar</span>
    </label>
  </div>

  {#if palette.length === 0 && !error}
    <button class="extract-btn" onclick={extractPalette} disabled={extracting}>
      {#if extracting}
        <div class="spinner"></div>
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
    <p class="hint">Extract all colors from the active tab</p>
  {/if}

  {#if error}
    <div class="error-msg">{error}</div>
    <button class="retry-btn" onclick={extractPalette}>Try Again</button>
  {/if}

  {#if palette.length > 0}
    <div class="palette-actions">
      <span class="count">{palette.length} colors found</span>
      <button class="clear-btn" onclick={() => palette = []}>Clear</button>
    </div>

    <div class="palette-grid">
      {#each palette as color (color.hex)}
        <button
          class="palette-swatch"
          style="background-color: {color.hex};"
          onclick={() => oncolorselect(color.hex)}
          title="{color.hex} • {getTypeLabel(color.type)} • {color.count} uses"
        >
          <span class="type-icon">{getTypeIcon(color.type)}</span>
          <span 
            class="swatch-label" 
            style="color: {luminance(color.hex) > 0.6 ? '#1D1D1F' : '#FFFFFF'};"
          >
            {color.hex}
          </span>
        </button>
      {/each}
    </div>

    <button class="extract-btn secondary" onclick={extractPalette} disabled={extracting}>
      {extracting ? 'Extracting...' : 'Extract Again'}
    </button>
  {/if}
</section>

<style>
  .palette-extractor {
    background: var(--bg-subtle);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .extractor-header {
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

  .group-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .group-toggle input {
    cursor: pointer;
  }

  .extract-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .extract-btn:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-0.5px);
  }

  .extract-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .extract-btn.secondary {
    background: #FFFFFF;
    color: var(--accent);
    border: 1px solid var(--border);
  }

  .extract-btn.secondary:hover:not(:disabled) {
    background: var(--bg-subtle);
    border-color: var(--accent);
  }

  .extract-btn svg {
    stroke: currentColor;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .hint {
    font-size: 11px;
    color: var(--text-secondary);
    text-align: center;
    margin: 0;
  }

  .error-msg {
    padding: 8px 10px;
    font-size: 12px;
    color: #FF3B30;
    background: rgba(255, 59, 48, 0.08);
    border-radius: 6px;
    text-align: center;
  }

  .retry-btn {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    color: var(--accent);
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .retry-btn:hover {
    border-color: var(--accent);
    background: rgba(0, 113, 227, 0.05);
  }

  .palette-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .count {
    font-size: 11px;
    font-weight: 500;
    color: var(--text);
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

  .palette-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .palette-swatch {
    aspect-ratio: 1;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 4px;
  }

  .palette-swatch:hover {
    transform: scale(1.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  .type-icon {
    font-size: 12px;
    opacity: 0.8;
  }

  .swatch-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
</style>