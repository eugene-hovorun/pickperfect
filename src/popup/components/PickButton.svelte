<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    picking: boolean;
    hasEyeDropper: boolean;
    error: string | null;
    onpick: () => void;
  }

  let { picking, hasEyeDropper, error, onpick }: Props = $props();
</script>

<div class="px-4 pb-3">
  {#if hasEyeDropper}
    <button 
      class={cn(
        "flex items-center justify-center gap-2 w-full py-3 px-4",
        "text-sm font-semibold text-primary-foreground rounded-xl transition-all",
        "bg-primary hover:bg-primary/90",
        picking 
          ? "opacity-70 cursor-wait" 
          : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
      )}
      onclick={onpick} 
      disabled={picking}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-white">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
      </svg>
      {picking ? 'Picking…' : 'Pick a Color'}
    </button>
  {:else}
    <div class="px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
      EyeDropper API not available. Please use Chrome 95+.
    </div>
  {/if}

  {#if error}
    <div class="mt-2 px-3 py-2.5 text-xs text-destructive bg-destructive/10 rounded-lg text-center">
      {error}
    </div>
  {/if}
</div>