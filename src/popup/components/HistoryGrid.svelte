<script lang="ts">
  import { cn } from '$lib/utils';
  import type { ColorEntry } from '$lib/storage';

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
  <section class="flex flex-col gap-2">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
        HISTORY
      </span>
      <button
        onclick={onclear}
        class="h-6 px-2 text-[11px] font-medium rounded-md transition-colors text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        Clear
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-8 gap-1.5">
      {#each history as entry (entry.hex)}
        <button
          class={cn(
            "aspect-square rounded-lg cursor-pointer transition-all duration-150",
            "border-[1.5px]",
            currentColor === entry.hex
              ? "border-primary shadow-[0_0_0_2px_hsl(var(--primary))] z-10"
              : "border-border hover:scale-110 hover:shadow-md hover:z-10"
          )}
          style="background-color: {entry.hex};"
          onclick={() => onselect(entry.hex)}
          oncontextmenu={(e) => handleRemove(e, entry.hex)}
          title="{entry.hex} — right-click to remove"
        ></button>
      {/each}
    </div>
  </section>
{/if}