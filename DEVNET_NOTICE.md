# 🧪 Devnet Testing Mode

## Current Configuration

**Network:** Devnet (for testing)
- Server RPC: `https://api.devnet.solana.com`
- Frontend RPC: `https://api.devnet.solana.com`

## Testing Instructions

1. **Get Devnet SOL:**
   - Visit: https://faucet.solana.com/
   - Enter your Phantom wallet address
   - Request devnet SOL (free for testing)

2. **Switch Phantom to Devnet:**
   - Open Phantom wallet
   - Go to Settings → Developer Mode
   - Toggle "Testnet Mode" ON
   - Or use the network switcher in Phantom

3. **Test Transaction:**
   - Connect your Phantom wallet (devnet mode)
   - Send a small amount (0.01 SOL or less)
   - Watch the privacy animation
   - Check transaction on Solana Explorer (devnet)

## Important Notes

- **Devnet SOL is FREE** - Use as much as you need for testing
- **Transactions are FAKE** - No real value
- **All features work the same** - Time dilation, decimal dusting, memo noise, etc.
- **Ghost dance works** - Same routing logic
- **Rent reclamation works** - Same cleanup logic

## Switch Back to Mainnet

When ready for production:

1. **server.js** (line 12):
   ```javascript
   const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
   ```

2. **public/app.js** (line 4):
   ```javascript
   const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
   ```

3. Restart server

## Devnet Explorer

View your transactions:
https://explorer.solana.com/?cluster=devnet

---

**Current Status:** ✅ Running on Devnet
**Server:** http://localhost:3000

