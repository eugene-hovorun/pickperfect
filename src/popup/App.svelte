<script lang="ts">
  import FreePopup from './components/FreePopup.svelte';
  import PremiumPopup from './components/PremiumPopup.svelte';
  import ExtPay from 'extpay';

  let isPremium = $state(false);
  let isLoading = $state(true);

  const extpay = ExtPay('pickperfect');

  // Check premium status on mount
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
  <div class="loading">
    <div class="spinner"></div>
  </div>
{:else if isPremium}
  <PremiumPopup />
{:else}
  <FreePopup />
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    width: 360px;
    min-height: 200px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: #FFFFFF;
    color: #1D1D1F;
    -webkit-font-smoothing: antialiased;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 16px;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2.5px solid #E5E5EA;
    border-top-color: #0071E3;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>