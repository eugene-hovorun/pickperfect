<script lang="ts">
  import type { ColorFormat } from "$lib/colors";
  import { cn } from "$lib/utils";

  interface Props {
    formats: Readonly<ColorFormat[]>;
    current: ColorFormat;
    onswitch: (format: ColorFormat) => void;
  }

  let { formats, current, onswitch }: Props = $props();
</script>

<div
  class="inline-flex items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground gap-0.5"
>
  {#each formats as format}
    <button
      type="button"
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium tracking-wide ring-offset-background transition-all",
        "hover:text-foreground",
        current === format && "bg-background text-foreground shadow-sm"
      )}
      onclick={() => onswitch(format)}
    >
      {format.toUpperCase()}
    </button>
  {/each}
</div>