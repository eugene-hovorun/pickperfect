<script lang="ts">
  import { findNearestColor, luminance } from '../../lib/colors';
  import { tailwindColorsList } from '../../lib/tailwind';

  interface Props {
    color: string;
  }

  let { color }: Props = $props();

  let match = $derived(findNearestColor(color, tailwindColorsList));
  let isExactMatch = $derived(match.distance === 0);
  let accuracy = $derived(Math.max(0, 100 - (match.distance / 441.67) * 100)); // 441.67 = max RGB distance
  let textColor = $derived(luminance(color) > 0.6 ? '#1D1D1F' : '#FFFFFF');
  let matchTextColor = $derived(luminance(match.hex) > 0.6 ? '#1D1D1F' : '#FFFFFF');
</script>

<section class="tailwind-match">
  <div class="match-header">
    <span class="label">NEAREST TAILWIND COLOR</span>
    {#if isExactMatch}
      <span class="exact-badge">Exact Match</span>
    {:else}
      <span class="accuracy">{accuracy.toFixed(0)}% match</span>
    {/if}
  </div>

  <div class="colors-compare">
    <div class="color-box">
      <div class="color-swatch" style="background-color: {color}; color: {textColor};">
        {color}
      </div>
      <span class="color-label">Your Color</span>
    </div>

    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>

    <div class="color-box">
      <div class="color-swatch" style="background-color: {match.hex}; color: {matchTextColor};">
        {match.hex}
      </div>
      <span class="color-label">{match.name}</span>
    </div>
  </div>

  <div class="usage-example">
    <code>className="text-{match.name} bg-{match.name}"</code>
  </div>
</section>

<style>
  .tailwind-match {
    background: var(--bg-subtle);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .match-header {
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

  .exact-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    background: rgba(52, 199, 89, 0.15);
    color: #34C759;
    border-radius: 4px;
    letter-spacing: 0.3px;
  }

  .accuracy {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .colors-compare {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .colors-compare svg {
    flex-shrink: 0;
    stroke: var(--text-secondary);
  }

  .color-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .color-swatch {
    height: 56px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    border: 1px solid var(--border);
  }

  .color-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text);
    text-align: center;
  }

  .usage-example {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 10px;
  }

  code {
    font-size: 11px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
    color: var(--text);
    word-break: break-all;
  }
</style>