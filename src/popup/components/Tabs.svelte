<script lang="ts">
  import { cn } from '$lib/utils';

  type Tab = 'color' | 'tailwind' | 'compare' | 'palette';

  interface Props {
    activeTab: Tab;
    onchange: (tab: Tab) => void;
  }

  let { activeTab, onchange }: Props = $props();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'color', label: 'Color' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'compare', label: 'Compare' },
    { id: 'palette', label: 'Palette' },
  ];
</script>

<div class="flex border-b border-border px-4">
  {#each tabs as tab}
    <button 
      class={cn(
        "px-3 py-2 text-xs font-medium transition-colors relative grow",
        activeTab === tab.id
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onclick={() => onchange(tab.id)}
    >
      {tab.label}
      {#if activeTab === tab.id}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      {/if}
    </button>
  {/each}
</div>