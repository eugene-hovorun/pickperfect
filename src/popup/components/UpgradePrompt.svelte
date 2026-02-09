<script lang="ts">
  type Tab = 'tailwind' | 'compare' | 'palette';

  interface Props {
    tab: Tab;
    onupgrade: () => void;
  }

  let { tab, onupgrade }: Props = $props();

  const featureInfo = {
    tailwind: {
      icon: '🎨',
      title: 'Tailwind Color Mapping',
      description: 'Find the nearest Tailwind CSS color instantly with match accuracy.'
    },
    compare: {
      icon: '⚖️',
      title: 'WCAG Contrast Checker',
      description: 'Compare two colors for accessibility compliance (AA/AAA).'
    },
    palette: {
      icon: '🌈',
      title: 'Page Palette Extraction',
      description: 'Extract all colors from any webpage with one click.'
    }
  };

  const info = $derived(featureInfo[tab]);
</script>

<div class="flex flex-col items-center gap-4 py-8 px-4">
  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/50 to-orange-200/50 flex items-center justify-center text-2xl">
    {info.icon}
  </div>
  
  <div class="text-center">
    <h3 class="text-sm font-semibold text-foreground mb-1">
      {info.title}
    </h3>
    <p class="text-xs text-muted-foreground">
      {info.description}
    </p>
  </div>

  <div class="w-full bg-muted/50 rounded-lg p-3 border border-border">
    <div class="flex items-center justify-between mb-2">
      <span class="text-[11px] font-semibold px-2 py-1 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded-md tracking-wide">
        ✨ Premium
      </span>
      <span class="text-sm font-bold text-foreground">
        $2.99 once
      </span>
    </div>
    <button 
      class="w-full py-2.5 px-3.5 text-sm font-semibold text-white bg-gradient-to-br from-primary to-blue-700 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
      onclick={onupgrade}
    >
      Upgrade to Premium
    </button>
  </div>

  <div class="text-center space-y-1">
    <p class="text-[10px] text-muted-foreground">All 3 premium features included:</p>
    <p class="text-[10px] text-muted-foreground">Tailwind • Compare • Palette</p>
  </div>
</div>