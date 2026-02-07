// PickPerfect Background Service Worker
// The _execute_action command in manifest.json automatically opens the popup.
// This service worker handles any future background tasks (context menus, badge, etc.)

chrome.runtime.onInstalled.addListener(() => {
  console.log('PickPerfect installed');
});
