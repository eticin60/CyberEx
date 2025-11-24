import { WalletManager } from '../services/walletManager';
import { MessageHandler } from '../services/messageHandler';

// Service Worker başlatıldığında
chrome.runtime.onInstalled.addListener(() => {
  console.log('CyberEx Wallet yüklendi');
});

// Mesaj dinleyicisi
chrome.runtime.onMessage.addListener((
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  MessageHandler.handle(message, sender, sendResponse);
  return true; // Async response için
});

// Tab güncellemelerini dinle
chrome.tabs.onUpdated.addListener((
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Gerekirse sayfa yüklendiğinde işlemler yapılabilir
  }
});

