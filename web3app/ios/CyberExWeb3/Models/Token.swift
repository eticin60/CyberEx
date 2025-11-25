import Foundation

struct Token: Identifiable, Codable {
    let id: String
    let symbol: String
    let name: String
    let logoUrl: String?
    let contractAddress: String?
    let balance: String
    let balanceUsd: String
    let price: String
    let priceChange24h: Double
    let network: String
    let decimals: Int
    let isCustom: Bool
    
    var priceChangeFormatted: String {
        priceChange24h >= 0 ? "+\(String(format: "%.2f", priceChange24h))%" : "\(String(format: "%.2f", priceChange24h))%"
    }
    
    var isPositiveChange: Bool {
        priceChange24h >= 0
    }
}

