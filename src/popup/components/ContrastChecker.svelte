<script lang="ts">
  import { checkContrast, luminance } from '../../lib/colors';

  interface Props {
    color1: string;
    color2: string;
  }

  let { color1, color2 }: Props = $props();

  let compliance = $derived(checkContrast(color1, color2));
  let textColor1 = $derived(luminance(color1) > 0.6 ? '#1D1D1F' : '#FFFFFF');
  let textColor2 = $derived(luminance(color2) > 0.6 ? '#1D1D1F' : '#FFFFFF');
</script>

<section class="contrast-checker">
  <div class="checker-header">
    <span class="label">CONTRAST CHECKER</span>
  </div>
  
  <div class="colors-compare">
    <div class="color-chip" style="background-color: {color1}; color: {textColor1};">
      {color1}
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
    <div class="color-chip" style="background-color: {color2}; color: {textColor2};">
      {color2}
    </div>
  </div>

  <div class="ratio-display">
    <span class="ratio-value">{compliance.ratio.toFixed(2)}:1</span>
    <span class="ratio-label">Contrast Ratio</span>
  </div>

  <div class="wcag-badges">
    <div class="badge-row">
      <span class="badge-label">Large Text</span>
      <div class="badges">
        <span class="badge" class:pass={compliance.aaLarge} class:fail={!compliance.aaLarge}>
          {compliance.aaLarge ? '✓' : '✕'} AA
        </span>
        <span class="badge" class:pass={compliance.aaaLarge} class:fail={!compliance.aaaLarge}>
          {compliance.aaaLarge ? '✓' : '✕'} AAA
        </span>
      </div>
    </div>
    <div class="badge-row">
      <span class="badge-label">Normal Text</span>
      <div class="badges">
        <span class="badge" class:pass={compliance.aaNormal} class:fail={!compliance.aaNormal}>
          {compliance.aaNormal ? '✓' : '✕'} AA
        </span>
        <span class="badge" class:pass={compliance.aaaNormal} class:fail={!compliance.aaaNormal}>
          {compliance.aaaNormal ? '✓' : '✕'} AAA
        </span>
      </div>
    </div>
  </div>

  <p class="hint">Large text: 18pt+ or 14pt+ bold</p>
</section>

<style>
  .contrast-checker {
    background: var(--bg-subtle);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .checker-header {
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

  .colors-compare {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .colors-compare svg {
    flex-shrink: 0;
    stroke: var(--text-secondary);
  }

  .color-chip {
    flex: 1;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    border: 1px solid var(--border);
  }

  .ratio-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 0;
  }

  .ratio-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
  }

  .ratio-label {
    font-size: 11px;
    color: var(--text-secondary);
  }

  .wcag-badges {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .badge-label {
    font-size: 12px;
    color: var(--text);
  }

  .badges {
    display: flex;
    gap: 6px;
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.3px;
  }

  .badge.pass {
    background: rgba(52, 199, 89, 0.15);
    color: #34C759;
  }

  .badge.fail {
    background: rgba(255, 59, 48, 0.1);
    color: #FF3B30;
  }

  .hint {
    font-size: 10px;
    color: var(--text-secondary);
    text-align: center;
    margin: 0;
    opacity: 0.7;
  }
</style>