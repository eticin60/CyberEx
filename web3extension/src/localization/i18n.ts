export const translations = {
    tr: {
        walletTitle: 'CyberEx Wallet',
        walletNotFound: 'Cüzdan Bulunamadı',
        startText: 'Başlamak için bir cüzdan oluşturun veya içe aktarın',
        createWallet: 'Yeni Cüzdan Oluştur',
        importWallet: 'Cüzdan İçe Aktar',
        balance: 'Bakiye',
        refresh: 'Yenile',
        send: 'Gönder',
        receive: 'Al',
        swap: 'Swap',
        leverage: 'Kaldıraç',
        wallets: 'Cüzdanlar',
        campaigns: 'Kampanyalar',
        settings: 'Ayarlar',
        network: 'Ağ',
        copy: 'Kopyala',
        copied: 'Kopyalandı',
        error: 'Hata',
        loading: 'Yükleniyor...'
    },
    en: {
        walletTitle: 'CyberEx Wallet',
        walletNotFound: 'Wallet Not Found',
        startText: 'Create or import a wallet to get started',
        createWallet: 'Create New Wallet',
        importWallet: 'Import Wallet',
        balance: 'Balance',
        refresh: 'Refresh',
        send: 'Send',
        receive: 'Receive',
        swap: 'Swap',
        leverage: 'Leverage',
        wallets: 'Wallets',
        campaigns: 'Campaigns',
        settings: 'Settings',
        network: 'Network',
        copy: 'Copy',
        copied: 'Copied',
        error: 'Error',
        loading: 'Loading...'
    }
};

export type Language = 'tr' | 'en';

export const getLanguage = (): Language => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'tr') ? saved : 'tr';
};

export const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    window.location.reload(); // Simple reload to apply changes
};
