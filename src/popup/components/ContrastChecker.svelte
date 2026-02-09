<script lang="ts">
  import { checkContrast, luminance } from '$lib/colors';
  import { cn } from '$lib/utils';

  interface Props {
    color1: string;
    color2: string;
  }

  let { color1, color2 }: Props = $props();

  let compliance = $derived(checkContrast(color1, color2));
  let textColor1 = $derived(luminance(color1) > 0.6 ? '#1D1D1F' : '#FFFFFF');
  let textColor2 = $derived(luminance(color2) > 0.6 ? '#1D1D1F' : '#FFFFFF');
</script>

<section class="bg-muted/50 rounded-xl p-3 flex flex-col gap-3">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <span class="text-[11px] font-medium text-muted-foreground tracking-wider">
      CONTRAST CHECKER
    </span>
  </div>
  
  <!-- Color Comparison -->
  <div class="flex items-center gap-2">
    <div 
      class="flex-1 h-11 rounded-lg flex items-center justify-center text-[11px] font-semibold tracking-wide border border-border"
      style="background-color: {color1}; color: {textColor1};"
    >
      {color1}
    </div>
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
      class="flex-shrink-0 text-muted-foreground"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
    <div 
      class="flex-1 h-11 rounded-lg flex items-center justify-center text-[11px] font-semibold tracking-wide border border-border"
      style="background-color: {color2}; color: {textColor2};"
    >
      {color2}
    </div>
  </div>

  <!-- Ratio Display -->
  <div class="flex flex-col items-center gap-0.5 py-2">
    <span class="text-2xl font-bold text-foreground">
      {compliance.ratio.toFixed(2)}:1
    </span>
    <span class="text-[11px] text-muted-foreground">
      Contrast Ratio
    </span>
  </div>

  <!-- WCAG Badges -->
  <div class="flex flex-col gap-2">
    <!-- Large Text -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-foreground">Large Text</span>
      <div class="flex gap-1.5">
        <span 
          class={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide",
            compliance.aaLarge 
              ? "bg-green-500/15 text-green-600 dark:text-green-500" 
              : "bg-destructive/10 text-destructive"
          )}
        >
          {compliance.aaLarge ? '✓' : '✕'} AA
        </span>
        <span 
          class={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide",
            compliance.aaaLarge 
              ? "bg-green-500/15 text-green-600 dark:text-green-500" 
              : "bg-destructive/10 text-destructive"
          )}
        >
          {compliance.aaaLarge ? '✓' : '✕'} AAA
        </span>
      </div>
    </div>

    <!-- Normal Text -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-foreground">Normal Text</span>
      <div class="flex gap-1.5">
        <span 
          class={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide",
            compliance.aaNormal 
              ? "bg-green-500/15 text-green-600 dark:text-green-500" 
              : "bg-destructive/10 text-destructive"
          )}
        >
          {compliance.aaNormal ? '✓' : '✕'} AA
        </span>
        <span 
          class={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide",
            compliance.aaaNormal 
              ? "bg-green-500/15 text-green-600 dark:text-green-500" 
              : "bg-destructive/10 text-destructive"
          )}
        >
          {compliance.aaaNormal ? '✓' : '✕'} AAA
        </span>
      </div>
    </div>
  </div>

  <!-- Hint -->
  <p class="text-[10px] text-muted-foreground text-center m-0 opacity-70">
    Large text: 18pt+ or 14pt+ bold
  </p>
</section>