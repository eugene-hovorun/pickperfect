<script lang="ts">
  import FormatPills from './FormatPills.svelte';
  import type { ColorFormat } from '$lib/colors';

  interface Props {
    formats: Readonly<ColorFormat[]>;
    currentFormat: ColorFormat;
    onformatchange: (format: ColorFormat) => void;
    isPremium?: boolean;
  }

  let { formats, currentFormat, onformatchange, isPremium = false }: Props = $props();
</script>

<header class="flex items-center justify-between p-4 pb-3">
  <div class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
    <img src="./icons/icon-48.png" alt="" width="18" height="18" />
    <span>PickPerfect</span>
    {#if isPremium}
      <span class="text-[9px] font-bold px-1.5 py-0.5 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded tracking-wider ml-1">
        ✨ PRO
      </span>
    {/if}
  </div>
  <FormatPills 
    formats={formats} 
    current={currentFormat} 
    onswitch={onformatchange} 
  />
</header>