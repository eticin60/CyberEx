import React, { useState } from 'react';
import { WalletManager } from '../../services/walletManager';
import { translations, getLanguage } from '../../localization/i18n';
import { ethers } from 'ethers';
import { NetworkManager } from '../../services/networkManager';

interface ImportTokenProps {
    onNavigate: (view: string) => void;
}

const ImportToken: React.FC<ImportTokenProps> = ({ onNavigate }) => {
    const [address, setAddress] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState('');
    const [loading, setLoading] = useState(false);

    const lang = getLanguage();
    const t = translations[lang];

    const handleBlur = async () => {
        // Auto-fetch details if valid address
        if (ethers.isAddress(address) && !symbol) {
            setLoading(true);
            try {
                const network = await NetworkManager.getCurrentNetwork();
                const provider = new ethers.JsonRpcProvider(network.rpcUrl);
                const contract = new ethers.Contract(address, [
                    'function symbol() view returns (string)',
                    'function decimals() view returns (uint8)'
                ], provider);

                const [sym, dec] = await Promise.all([
                    contract.symbol().catch(() => ''),
                    contract.decimals().catch(() => 18)
                ]);

                if (sym) setSymbol(sym);
                setDecimals(dec.toString());
            } catch (e) {
                console.error('Token fetch error:', e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleImport = async () => {
        if (!ethers.isAddress(address)) {
            alert('Geçersiz adres');
            return;
        }

        const network = await NetworkManager.getCurrentNetwork();

        await WalletManager.addToken({
            address,
            symbol: symbol || 'UNKNOWN',
            decimals: parseInt(decimals || '18'),
            network: network.name
        });

        onNavigate('home');
    };

    return (
        <div className="import-wallet-container">
            <div className="header">
                <button className="back-btn" onClick={() => onNavigate('home')}>
                    ← {t.back}
                </button>
                <h2>{t.importToken}</h2>
            </div>

            <div className="form-group">
                <label>{t.tokenAddress}</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="0x..."
                />
            </div>

            <div className="form-group">
                <label>{t.tokenSymbol}</label>
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="ETH, USDT..."
                />
            </div>

            <div className="form-group">
                <label>{t.tokenDecimals}</label>
                <input
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    placeholder="18"
                />
            </div>

            <div className="form-actions">
                <button className="btn-primary" onClick={handleImport} disabled={loading || !address}>
                    {loading ? t.loading : t.add}
                </button>
            </div>
        </div>
    );
};

export default ImportToken;
