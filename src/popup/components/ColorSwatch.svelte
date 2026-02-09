<script lang="ts">
  import { formatColor, luminance, type ColorFormat } from '$lib/colors';
  import { cn } from '$lib/utils';

  interface Props {
    color: string;
    format: ColorFormat;
    copied: boolean;
    oncopy: () => void;
  }

  let { color, format, copied, oncopy }: Props = $props();

  let displayValue = $derived(formatColor(color, format));
  let textOnSwatch = $derived(luminance(color) > 0.6 ? '#1D1D1F' : '#FFFFFF');
</script>

<button
  class={cn(
    "group w-full h-20 rounded-xl",
    "flex items-center justify-center",
    "cursor-pointer transition-all duration-150",
    "border border-border",
    "hover:-translate-y-0.5 hover:shadow-lg",
    "active:translate-y-0"
  )}
  style="background-color: {color};"
  onclick={oncopy}
  title="Click to copy"
>
  <span 
    class="text-base font-semibold tracking-wide flex items-center gap-1.5"
    style="color: {textOnSwatch}; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);"
  >
    {#if copied}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Copied!
    {:else}
      {displayValue}
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="opacity-0 group-hover:opacity-70 transition-opacity duration-150"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    {/if}
  </span>
</button>