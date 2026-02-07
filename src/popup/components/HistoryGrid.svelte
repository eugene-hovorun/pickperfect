<script lang="ts">
  import type { ColorEntry } from '../../lib/storage';

  interface Props {
    history: ColorEntry[];
    currentColor: string | null;
    onselect: (hex: string) => void;
    onremove: (hex: string) => void;
    onclear: () => void;
  }

  let { history, currentColor, onselect, onremove, onclear }: Props = $props();

  function handleRemove(e: MouseEvent, hex: string) {
    e.preventDefault();
    onremove(hex);
  }
</script>

{#if history.length > 0}
  <section class="history">
    <div class="history-header">
      <span class="label">HISTORY</span>
      <button class="clear-btn" onclick={onclear}>Clear</button>
    </div>
    <div class="history-grid">
      {#each history as entry (entry.hex)}
        <button
          class="history-swatch"
          class:selected={currentColor === entry.hex}
          style="background-color: {entry.hex};"
          onclick={() => onselect(entry.hex)}
          oncontextmenu={(e) => handleRemove(e, entry.hex)}
          title="{entry.hex} — right-click to remove"
        ></button>
      {/each}
    </div>
  </section>
{/if}

<style>
  .history {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-header {
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

  .history-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
  }

  .history-swatch {
    aspect-ratio: 1;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }

  .history-swatch:hover {
    transform: scale(1.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  .history-swatch.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
  }
</style>