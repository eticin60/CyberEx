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
        loading: 'Yükleniyor...',
        back: 'Geri',
        backupTitle: 'Yedekleme Kelimeleri',
        backupWarningTitle: 'ÖNEMLİ: Bu kelimeleri güvenli bir yerde saklayın!',
        backupWarningText: 'Bu kelimeler cüzdanınızı geri yüklemek için gereklidir. Kimseyle paylaşmayın ve güvenli bir yerde saklayın.',
        copyMnemonic: 'Kopyala',
        backupConfirm: 'Yedekledim, Devam Et',
        createWalletTitle: 'Yeni Cüzdan Oluştur',
        walletNameLabel: 'Cüzdan Adı (Opsiyonel)',
        walletNamePlaceholder: 'Örn: Ana Cüzdan',
        walletCreateInfo: 'Yeni bir cüzdan oluşturulacak ve size 12 kelimelik bir yedekleme ifadesi verilecektir. Bu ifadeyi mutlaka güvenli bir yerde saklayın.',
        creating: 'Oluşturuluyor...'
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
        loading: 'Loading...',
        back: 'Back',
        backupTitle: 'Backup Mnemonic',
        backupWarningTitle: 'IMPORTANT: Save these words safely!',
        backupWarningText: 'These words are required to restore your wallet. Do not share them with anyone and keep them safe.',
        copyMnemonic: 'Copy',
        backupConfirm: 'I Saved It, Continue',
        createWalletTitle: 'Create New Wallet',
        walletNameLabel: 'Wallet Name (Optional)',
        walletNamePlaceholder: 'Ex: Main Wallet',
        walletCreateInfo: 'A new wallet will be created and you will be given a 12-word backup phrase. Make sure to keep this phrase safe.',
        creating: 'Creating...'
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
