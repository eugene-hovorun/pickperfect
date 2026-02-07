// PickPerfect Background Service Worker

import ExtPay from "extpay";

const extpay = ExtPay("pickperfect");

extpay.startBackground();

extpay.getUser().then((user) => {
  chrome.storage.local.set({ isPremium: user.paid });
});

extpay.onPaid.addListener((user) => {
  chrome.storage.local.set({ isPremium: true });
});
