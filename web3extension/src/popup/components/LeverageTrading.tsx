import React, { useState, useEffect } from 'react';
import { Wallet } from '../../services/walletManager';
import { LeverageTradingManager, LeveragePosition } from '../../services/leverageTrading';
import { NetworkManager } from '../../services/networkManager';

interface LeverageTradingProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
}

const LeverageTrading: React.FC<LeverageTradingProps> = ({ currentWallet, onNavigate }) => {
  const [positions, setPositions] = useState<LeveragePosition[]>([]);
  const [showNewPosition, setShowNewPosition] = useState(false);
  const [coin, setCoin] = useState('ETH');
  const [positionType, setPositionType] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState(10);
  const [amount, setAmount] = useState('');
  const [collateral, setCollateral] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentWallet) {
      loadPositions();
    }
  }, [currentWallet]);

  const loadPositions = async () => {
    if (!currentWallet) return;
    const pos = await LeverageTradingManager.getPositions(currentWallet.address);
    setPositions(pos);
  };

  const handleOpenPosition = async () => {
    if (!currentWallet || !amount || !collateral) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const network = await NetworkManager.getCurrentNetwork();
      await LeverageTradingManager.openPosition(
        currentWallet.address,
        coin,
        network.name.toLowerCase(),
        positionType,
        leverage,
        amount,
        collateral
      );
      await loadPositions();
      setShowNewPosition(false);
      setAmount('');
      setCollateral('');
    } catch (error: any) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    if (confirm('Bu pozisyonu kapatmak istediğinize emin misiniz?')) {
      await LeverageTradingManager.closePosition(positionId);
      await loadPositions();
    }
  };

  if (!currentWallet) {
    return (
      <div className="leverage-trading-container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Geri
          </button>
          <h2>Kaldıraçlı İşlemler</h2>
        </div>
        <div className="empty-state">
          <p>Cüzdan bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leverage-trading-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Kaldıraçlı İşlemler</h2>
        <button className="add-btn" onClick={() => setShowNewPosition(!showNewPosition)}>
          {showNewPosition ? '✕' : '+'}
        </button>
      </div>

      {showNewPosition && (
        <div className="new-position-form">
          <h3>Yeni Pozisyon Aç</h3>
          
          <div className="form-group">
            <label>Coin</label>
            <select value={coin} onChange={(e) => setCoin(e.target.value)}>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
              <option value="BNB">BNB</option>
              <option value="MATIC">MATIC</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pozisyon Tipi</label>
            <div className="position-type-selector">
              <button
                className={`type-btn ${positionType === 'long' ? 'active' : ''}`}
                onClick={() => setPositionType('long')}
              >
                Long (Yükseliş)
              </button>
              <button
                className={`type-btn ${positionType === 'short' ? 'active' : ''}`}
                onClick={() => setPositionType('short')}
              >
                Short (Düşüş)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Kaldıraç: {leverage}x</label>
            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
            />
            <div className="leverage-options">
              {[2, 5, 10, 20, 50, 100].map(lev => (
                <button
                  key={lev}
                  className={`leverage-btn ${leverage === lev ? 'active' : ''}`}
                  onClick={() => setLeverage(lev)}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Miktar</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </div>

          <div className="form-group">
            <label>Teminat (Collateral)</label>
            <input
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="0.0"
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleOpenPosition}
              disabled={loading}
            >
              {loading ? 'Açılıyor...' : 'Pozisyon Aç'}
            </button>
          </div>
        </div>
      )}

      <div className="positions-list">
        <h3>Açık Pozisyonlar</h3>
        {positions.filter(p => p.status === 'open').length === 0 ? (
          <div className="empty-state">
            <p>Henüz açık pozisyon yok</p>
          </div>
        ) : (
          positions
            .filter(p => p.status === 'open')
            .map((position) => (
              <div key={position.id} className="position-card">
                <div className="position-header">
                  <div className="position-type-badge">
                    {position.positionType === 'long' ? '📈 Long' : '📉 Short'}
                  </div>
                  <div className="position-leverage">{position.leverage}x</div>
                </div>
                <div className="position-info">
                  <div className="info-row">
                    <span>Coin:</span>
                    <span>{position.coin}</span>
                  </div>
                  <div className="info-row">
                    <span>Giriş Fiyatı:</span>
                    <span>${position.entryPrice}</span>
                  </div>
                  <div className="info-row">
                    <span>Güncel Fiyat:</span>
                    <span>${position.currentPrice}</span>
                  </div>
                  <div className="info-row">
                    <span>PnL:</span>
                    <span className={parseFloat(position.pnl) >= 0 ? 'profit' : 'loss'}>
                      {parseFloat(position.pnl) >= 0 ? '+' : ''}
                      {parseFloat(position.pnl).toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Liquidation Fiyatı:</span>
                    <span className="warning">${position.liquidationPrice}</span>
                  </div>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleClosePosition(position.id)}
                >
                  Pozisyonu Kapat
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LeverageTrading;

