<script lang="ts">
  import FreePopup from './FreePopup.svelte';
  import PremiumPopup from './PremiumPopup.svelte';
  import ExtPay from 'extpay';

  let isPremium = $state(false);
  let isLoading = $state(true);

  const extpay = ExtPay('pickperfect');

  // Check premium status on mount
  $effect(() => {
    (async () => {
      try {
        // Check storage first (fast)
        const result = await chrome.storage.local.get('isPremium');
        isPremium = result.isPremium === true;
        isLoading = false;
        
        // Then verify with ExtPay in background (slower, but accurate)
        const user = await extpay.getUser();
        if (user.paid !== isPremium) {
          isPremium = user.paid;
          await chrome.storage.local.set({ isPremium: user.paid });
        }
      } catch (error) {
        console.error('Failed to check premium status:', error);
        isPremium = false;
        isLoading = false;
      }
    })();
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center min-h-[200px] p-4">
    <div class="w-6 h-6 border-[2.5px] border-border border-t-primary rounded-full animate-spin"></div>
  </div>
{:else if isPremium}
  <PremiumPopup />
{:else}
  <FreePopup />
{/if}