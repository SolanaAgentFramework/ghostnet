// Configuration for GitHub Pages deployment
// Update these with your actual vault and black mirror wallet addresses
const CONFIG = {
    // Vault and Black Mirror wallet addresses (set these after generating wallets)
    VAULT_ADDRESS: 'JChojPahR9scTF63ETisQ6YGTuhkq5B1Ud9w1XkanyRT',
    BLACK_MIRROR_ADDRESS: 'DeN4LPaUCUwYHfAeVAHh3gzYtpg93HHHA7BYEtBrGbxC',
    
    // API endpoint (empty for GitHub Pages, or set to your backend URL)
    API_URL: 'http://localhost:3000', // Backend server URL (change to '' for GitHub Pages static mode)
    
    // Decoy settings
    DECOY_ENABLED: true,
    DECOY_COUNT: 3, // Number of decoy transactions
    DECOY_AMOUNT_MIN: 0.0001, // Minimum decoy amount (SOL)
    DECOY_AMOUNT_MAX: 0.001, // Maximum decoy amount (SOL)
    
    // Merkle tree settings
    MERKLE_ENABLED: true,
    MERKLE_DEPTH: 4, // Depth of Merkle tree visualization
    
    // Ghost Dance (Intermediate Shards) settings
    GHOST_DANCE_ENABLED: true, // Enable ghost dance routing
    GHOST_SHARD_COUNT: 2, // Number of intermediate ghost wallets (recommended: 2 for 85-90% anonymity)
    // Options: 1 = 75-80% anonymity, 2 = 85-90% anonymity, 3 = 90-95% anonymity
    GHOST_DELAY_MIN: 500, // Minimum delay between shards (ms)
    GHOST_DELAY_MAX: 1000, // Maximum delay between shards (ms)
};

