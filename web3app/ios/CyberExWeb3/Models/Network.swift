import Foundation

struct Network: Identifiable, Codable {
    let id: String
    let name: String
    let chainId: Int64
    let rpcUrl: String
    let explorerUrl: String
    let nativeCurrency: String
    let logoUrl: String?
    let isCustom: Bool
    
    static let defaultNetworks: [Network] = [
        Network(
            id: "ethereum",
            name: "Ethereum",
            chainId: 1,
            rpcUrl: "https://eth.llamarpc.com",
            explorerUrl: "https://etherscan.io",
            nativeCurrency: "ETH",
            logoUrl: nil,
            isCustom: false
        ),
        Network(
            id: "bsc",
            name: "BNB Smart Chain",
            chainId: 56,
            rpcUrl: "https://bsc-dataseed.binance.org",
            explorerUrl: "https://bscscan.com",
            nativeCurrency: "BNB",
            logoUrl: nil,
            isCustom: false
        ),
        Network(
            id: "polygon",
            name: "Polygon",
            chainId: 137,
            rpcUrl: "https://polygon-rpc.com",
            explorerUrl: "https://polygonscan.com",
            nativeCurrency: "MATIC",
            logoUrl: nil,
            isCustom: false
        ),
        Network(
            id: "avalanche",
            name: "Avalanche",
            chainId: 43114,
            rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
            explorerUrl: "https://snowtrace.io",
            nativeCurrency: "AVAX",
            logoUrl: nil,
            isCustom: false
        )
    ]
}


