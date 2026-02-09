<script lang="ts">
  import ColorSwatch from './ColorSwatch.svelte';
  import HistoryGrid from './HistoryGrid.svelte';
  import type { ColorEntry } from '$lib/storage';
  import type { ColorFormat } from '$lib/colors';

  interface Props {
    currentColor: string | null;
    history: ColorEntry[];
    format: ColorFormat;
    copied: boolean;
    oncopy: () => void;
    onselect: (hex: string) => void;
    onremove: (hex: string) => void;
    onclear: () => void;
  }

  let { 
    currentColor, 
    history, 
    format, 
    copied, 
    oncopy, 
    onselect, 
    onremove, 
    onclear 
  }: Props = $props();
</script>

<div class="flex flex-col gap-3">
  {#if currentColor}
    <ColorSwatch
      color={currentColor}
      format={format}
      copied={copied}
      oncopy={oncopy}
    />
  {/if}

  <HistoryGrid
    history={history}
    currentColor={currentColor}
    onselect={onselect}
    onremove={onremove}
    onclear={onclear}
  />

  {#if !currentColor && history.length === 0}
    <div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
      <p class="text-sm m-0">Pick your first color to get started</p>
      <span class="text-[11px] font-medium px-2 py-0.5 bg-muted rounded font-mono text-muted-foreground">
        Ctrl + Shift + C
      </span>
    </div>
  {/if}
</div>