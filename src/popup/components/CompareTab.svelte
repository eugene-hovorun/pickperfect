<script lang="ts">
  import { cn } from '$lib/utils';
  import ContrastChecker from './ContrastChecker.svelte';
  import type { ColorEntry } from '$lib/storage';

  interface Props {
    history: ColorEntry[];
    selectedColors: string[];
    onselect: (hex: string) => void;
  }

  let { history, selectedColors, onselect }: Props = $props();

  function isSelected(hex: string): boolean {
    return selectedColors.includes(hex);
  }
</script>

<div class="flex flex-col gap-3">
  {#if selectedColors.length === 2}
    <ContrastChecker color1={selectedColors[0]} color2={selectedColors[1]} />
  {/if}

  {#if history.length > 0}
    <section class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
          SELECT 2 COLORS
        </span>
        <span class="text-[11px] font-medium text-muted-foreground">
          {selectedColors.length}/2
        </span>
      </div>
      
      <div class="grid grid-cols-8 gap-1.5">
        {#each history as entry (entry.hex)}
          <button
            class={cn(
              "aspect-square rounded-lg cursor-pointer transition-all border-[1.5px]",
              isSelected(entry.hex) 
                ? "border-amber-400 shadow-[0_0_0_2px_rgb(251,191,36)] z-10" 
                : "border-border hover:scale-110 hover:shadow-md hover:z-10"
            )}
            style="background-color: {entry.hex};"
            onclick={() => onselect(entry.hex)}
            title={`${entry.hex} — click to ${isSelected(entry.hex) ? 'deselect' : 'select'}`}
          ></button>
        {/each}
      </div>
      
      <p class="text-[11px] text-muted-foreground text-center m-0">
        Click two colors to compare their contrast ratio
      </p>
    </section>
  {:else}
    <div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
      <p class="text-sm m-0">Pick colors first to compare them</p>
    </div>
  {/if}
</div>