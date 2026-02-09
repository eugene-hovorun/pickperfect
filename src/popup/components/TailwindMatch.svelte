<script lang="ts">
  import { findNearestColor, luminance } from '$lib/colors';
  import { tailwindColorsList } from '$lib/tailwind';
  import { cn } from '$lib/utils';

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

<section class="bg-muted/50 rounded-xl p-3 flex flex-col gap-3">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
      NEAREST TAILWIND COLOR
    </span>
    {#if isExactMatch}
      <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-green-500/15 text-green-600 dark:text-green-500 rounded tracking-wide">
        Exact Match
      </span>
    {:else}
      <span class="text-[11px] font-medium text-muted-foreground">
        {accuracy.toFixed(0)}% match
      </span>
    {/if}
  </div>

  <!-- Color Comparison -->
  <div class="flex items-center gap-3">
    <!-- Your Color -->
    <div class="flex-1 flex flex-col gap-1.5">
      <div 
        class="h-14 rounded-lg flex items-center justify-center text-[11px] font-semibold tracking-wide border border-border"
        style="background-color: {color}; color: {textColor};"
      >
        {color}
      </div>
      <span class="text-[11px] font-medium text-foreground text-center">
        Your Color
      </span>
    </div>

    <!-- Arrow -->
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
      class="flex-shrink-0 text-muted-foreground"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>

    <!-- Tailwind Match -->
    <div class="flex-1 flex flex-col gap-1.5">
      <div 
        class="h-14 rounded-lg flex items-center justify-center text-[11px] font-semibold tracking-wide border border-border"
        style="background-color: {match.hex}; color: {matchTextColor};"
      >
        {match.hex}
      </div>
      <span class="text-[11px] font-medium text-foreground text-center">
        {match.name}
      </span>
    </div>
  </div>

  <!-- Usage Example -->
  <div class="bg-background border border-border rounded-lg px-2.5 py-2">
    <code class="text-[11px] font-mono text-foreground break-all">
      className="text-{match.name} bg-{match.name}"
    </code>
  </div>
</section>