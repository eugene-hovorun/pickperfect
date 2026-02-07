<script lang="ts">
  import type { ColorFormat } from '../../lib/colors';

  interface Props {
    formats: Readonly<ColorFormat[]>;
    current: ColorFormat;
    onswitch: (format: ColorFormat) => void;
  }

  let { formats, current, onswitch }: Props = $props();
</script>

<div class="format-pills">
  {#each formats as f}
    <button
      class="pill"
      class:active={current === f}
      onclick={() => onswitch(f)}
    >
      {f.toUpperCase()}
    </button>
  {/each}
</div>

<style>
  .format-pills {
    display: flex;
    gap: 2px;
    background: var(--bg-subtle);
    border-radius: 8px;
    padding: 2px;
  }

  .pill {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.3px;
  }

  .pill:hover {
    color: var(--text);
  }

  .pill.active {
    background: #FFFFFF;
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
</style>