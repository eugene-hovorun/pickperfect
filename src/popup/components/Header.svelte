<script lang="ts">
  import type { ColorFormat } from '$lib/colors';
  import FormatPills from './FormatPills.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    formats: ColorFormat[];
    currentFormat: ColorFormat;
    onformatchange: (format: ColorFormat) => void;
    isPremium?: boolean;
  }

  let { formats, currentFormat, onformatchange, isPremium = false }: Props = $props();
</script>

<header class="flex flex-col gap-2 p-4 pb-3">
  <!-- Row 1: Logo / Premium badge / Theme toggle -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
      <img src="./icons/icon-48.png" alt="" width="18" height="18" />
      <span>PickPerfect</span>
      {#if isPremium}
        <span class="text-[9px] font-bold px-1.5 py-0.5 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded tracking-wider ml-1">
          ✨ PRO
        </span>
      {/if}
    </div>
    <ThemeToggle />
  </div>

  <!-- Row 2: Format pills -->
  <FormatPills 
    formats={formats} 
    current={currentFormat} 
    onswitch={onformatchange} 
  />
</header>