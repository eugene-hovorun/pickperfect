<script lang="ts">
  import { formatColor, luminance, type ColorFormat } from '../../lib/colors';

  interface Props {
    color: string;
    format: ColorFormat;
    copied: boolean;
    oncopy: () => void;
  }

  let { color, format, copied, oncopy }: Props = $props();

  let displayValue = $derived(formatColor(color, format));
  let textOnSwatch = $derived(luminance(color) > 0.6 ? '#1D1D1F' : '#FFFFFF');
</script>

<button
  class="swatch-card"
  style="background-color: {color};"
  onclick={oncopy}
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

<style>
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
</style>