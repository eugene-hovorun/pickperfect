<script lang="ts">
  import { t } from "$lib/i18n";

  type Tab = "tailwind" | "compare" | "palette";

  interface Props {
    tab: Tab;
    onupgrade: () => void;
  }

  let { tab, onupgrade }: Props = $props();

  const featureInfo = {
    tailwind: {
      icon: "🎨",
      title: t("featureTailwindTitle"),
      description: t("featureTailwindDesc"),
    },
    compare: {
      icon: "⚖️",
      title: t("featureCompareTitle"),
      description: t("featureCompareDesc"),
    },
    palette: {
      icon: "🌈",
      title: t("featurePaletteTitle"),
      description: t("featurePaletteDesc"),
    },
  };

  const info = $derived(featureInfo[tab]);
</script>

<div class="flex flex-col items-center gap-4 py-8 px-4">
  <div
    class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/50 to-orange-200/50 flex items-center justify-center text-2xl"
  >
    {info.icon}
  </div>

  <div class="text-center">
    <h3 class="text-sm font-semibold text-foreground mb-1">{info.title}</h3>
    <p class="text-xs text-muted-foreground">{info.description}</p>
  </div>

  <div class="w-full bg-muted/50 rounded-lg p-3 border border-border">
    <div class="flex items-center justify-between mb-2">
      <span
        class="text-[11px] font-semibold px-2 py-1 bg-gradient-to-br from-amber-200/50 to-orange-200/50 text-foreground rounded-md tracking-wide"
      >
        {t("premiumBadge")}
      </span>
      <span class="text-sm font-bold text-foreground">
        {t("premiumPrice")}
      </span>
    </div>
    <button
      class="w-full py-2.5 px-3.5 text-sm font-semibold text-white bg-gradient-to-br from-primary to-blue-700 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0"
      onclick={onupgrade}
    >
      {t("upgradeToPremium")}
    </button>
  </div>

  <div class="text-center space-y-1">
    <p class="text-[10px] text-muted-foreground">
      {t("premiumFeaturesIncluded")}
    </p>
    <p class="text-[10px] text-muted-foreground">{t("premiumFeaturesList")}</p>
  </div>
</div>
