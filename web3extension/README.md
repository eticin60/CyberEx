# <img src="https://cyberex.com.tr/cyberex-logo.png" height="40" valign="middle" /> CyberEx Web3 Wallet Extension

[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.4.1-neon.svg)](CHANGELOG.md)
[![Status](https://img.shields.io/badge/Status-Beta-orange.svg)](STATUS.md)
[![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge%20%7C%20Brave-success.svg)]()
[![CyberEx Ecosystem](https://img.shields.io/badge/CyberEx-Ecosystem-800080.svg)](https://cyberex.com.tr)

**CyberEx Web3 Wallet** is a next-generation non-custodial browser extension designed for the **Web3 Financial Ecosystem**. It provides seamless access to 8+ blockchains, decentralized exchanges (DEXs), and leverage trading directly from your browser.

> **Note:** This extension is part of the CyberEx Ecosystem and is designed to work in harmony with the CyberEx Android App and Spot Exchange.

---

## 🌍 Supported Networks (Multi-Chain)

| Network | Chain ID | Native Asset | Explorer |
|:---|:---:|:---:|:---|
| **Ethereum** | 1 | ETH | Etherscan |
| **BNB Chain** | 56 | BNB | BscScan |
| **Polygon** | 137 | POL | PolygonScan |
| **Arbitrum One** | 42161 | ETH | Arbiscan |
| **Optimism** | 10 | ETH | Optimistic Etherscan |
| **Avalanche C-Chain** | 43114 | AVAX | Snowtrace |
| **Fantom** | 250 | FTM | FtmScan |
| **Base** | 8453 | ETH | BaseScan |

---

## 🚀 Key Features

### 🔐 Security First (Non-Custodial)
- **Local Key Storage:** Your Private Keys and Mnemonic Phrases are encrypted and stored **only on your device**.
- **Cold Wallet Logic:** Operates like a cold wallet until you sign a transaction.
- **Biometric Ready:** Prepared for integration with hardware authenticators.

### ⚡ Liquid Glass UI/UX
- **Ecosystem Design:** Features the signature CyberEx "Liquid Glass" dark theme with Neon Cyan and Purple accents.
- **Bilingual:** Full support for **Turkish (Türkçe)** and **English** languages.
- **Real-Time Data:** Live price feeds and balance updates via RPC aggregation.

### 💹 Advanced Trading
- **DEX Aggregator:** Finds the best swap rates across Uniswap, PancakeSwap, Curve, and more.
- **Leverage Trading:** Access decentralized perpetual futures with up to 100x leverage.
- **Gas Optimization:** Smart fee estimation to save on transaction costs.

---

## 🛠️ Installation (Developer Mode)

Since this is a specialized financial tool, you can build and load it directly from source for maximum security auditability.

### Prerequisites
- Node.js v16+
- npm or yarn

### Build Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/eticin60/CyberEx
    cd CyberEx/web3extension
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Build the Extension**
    ```bash
    npm run build
    ```
    *This will create a `dist` folder containing the production-ready extension.*

4.  **Load into Chrome/Brave/Edge**
    - Go to `chrome://extensions/`
    - Enable **Developer mode** (top right toggle).
    - Click **Load unpacked**.
    - Select the `web3extension/dist` directory.

---

## 🤝 Ecosystem Integration

This extension is built to synchronize with the **CyberEx Android App** and **Web Platform**.

- **Website:** [cyberex.com.tr](https://cyberex.com.tr)
- **Android App:** [Play Store Link]
- **Documentation:** [api.cyberex.com.tr](https://cyberex.com.tr/api-docs.html)
- **GitHub:** [eticin60/CyberEx](https://github.com/eticin60/CyberEx)

---

## 📄 License

**Copyright © 2026 CyberEx Technology Inc.**

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this source code is strictly prohibited without express written permission from CyberEx Technology Inc.

See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ by the CyberEx Dev Team. Powered by Google Gemini AI coding assistants.</sub>
</div>
