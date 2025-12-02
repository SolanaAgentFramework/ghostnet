# 🚀 Solana Airdrop Farming Script

## Overview

This script automatically farms devnet SOL airdrops by:
1. Creating a new Solana wallet
2. Requesting 5 SOL airdrop
3. Sending all funds to master wallet (with generous gas reserve)
4. Closing the account
5. Waiting for you to press Enter (change VPN)
6. Repeating until 100 SOL is farmed

## Features

- ✅ Automatic wallet generation
- ✅ 5 SOL airdrop requests
- ✅ Generous gas fees (0.01 SOL reserve)
- ✅ Account closing after transfer
- ✅ Wallet key storage (for recovery)
- ✅ Detailed logging
- ✅ Success/failure tracking
- ✅ Pause between cycles (for VPN change)

## Prerequisites

1. **Node.js** installed (v14+)
2. **PowerShell** (Windows)
3. **@solana/web3.js** package (auto-installed)

## Usage

### Basic Usage
```powershell
.\farm_airdrops.ps1
```

### Custom Parameters
```powershell
# Custom master wallet
.\farm_airdrops.ps1 -MasterWallet "YOUR_WALLET_ADDRESS"

# Custom target amount
.\farm_airdrops.ps1 -TargetAmount 50.0

# All parameters
.\farm_airdrops.ps1 -MasterWallet "94GP9qX5hRGwuRJJg3zdMC9pwHwDSaVkpxPSXdZAiDtF" -TargetAmount 100.0
```

## How It Works

1. **Generate Wallet**: Creates new Solana keypair
2. **Request Airdrop**: Requests 5 SOL from devnet faucet
3. **Wait Confirmation**: Waits up to 60 seconds for confirmation
4. **Send to Master**: Sends balance minus gas reserve (0.01 SOL) to master wallet
5. **Close Account**: Sends remaining balance to master and closes account
6. **Save Keys**: Stores wallet key in `farmed_wallets/` directory
7. **Wait for Enter**: Pauses for you to change VPN
8. **Repeat**: Goes back to step 1

## File Structure

```
farmed_wallets/          # Directory with all generated wallet keys
  ├── [wallet1].json
  ├── [wallet2].json
  └── ...

farming_log.txt          # Detailed log of all operations
farm_cycle.js           # Node.js script for farming cycle
farm_airdrops.ps1       # Main PowerShell script
```

## Wallet Key Format

Each wallet is saved as JSON:
```json
{
  "publicKey": "WalletAddress...",
  "secretKey": "Base58EncodedSecretKey...",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Gas Fee Strategy

- **Gas Reserve**: 0.01 SOL (generous)
- **Transaction Fee**: ~0.000005 SOL per transaction
- **Total Reserve**: ~0.01 SOL per wallet
- **Why**: Prevents "insufficient funds" errors when sending

## Troubleshooting

### "Airdrop failed"
- **Cause**: Rate limit or faucet dry
- **Solution**: Wait a few minutes, change VPN, try again

### "Insufficient funds for gas"
- **Cause**: Balance too low after airdrop
- **Solution**: Script automatically skips and continues

### "Node.js not found"
- **Cause**: Node.js not installed or not in PATH
- **Solution**: Install Node.js from https://nodejs.org/

### "429 Too Many Requests"
- **Cause**: Too many airdrop requests
- **Solution**: Wait longer between cycles, change VPN

## Tips

1. **Change VPN** between cycles to avoid rate limits
2. **Wait 2-3 minutes** between cycles if hitting limits
3. **Check logs** in `farming_log.txt` for details
4. **Recover wallets** from `farmed_wallets/` if needed
5. **Monitor master wallet** on Solscan to track progress

## Master Wallet

Default: `94GP9qX5hRGwuRJJg3zdMC9pwHwDSaVkpxPSXdZAiDtF`

Check balance:
- Solscan: https://solscan.io/account/94GP9qX5hRGwuRJJg3zdMC9pwHwDSaVkpxPSXdZAiDtF?cluster=devnet

## Safety Features

- ✅ Wallet keys saved for recovery
- ✅ Generous gas reserves prevent failures
- ✅ Error handling continues on failures
- ✅ Detailed logging for debugging
- ✅ Confirmation waits prevent race conditions

## Example Output

```
🚀 Solana Airdrop Farming Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Master Wallet: 94GP9qX5hRGwuRJJg3zdMC9pwHwDSaVkpxPSXdZAiDtF
Target Amount: 100 SOL
Network: devnet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cycle #1
Total Farmed: 0 SOL / 100 SOL

📦 Generated wallet: [address]
💰 Requesting 5 SOL airdrop...
✅ Transfer confirmed!
✅ Cycle complete! Sent 4.99 SOL to master wallet

✅ Cycle #1 SUCCESS!
   Amount sent: 4.99 SOL
   Total farmed: 4.99 SOL

⏸️  Press ENTER to continue (change VPN if needed)...
```

## Notes

- **Devnet Only**: This script works on devnet (testnet)
- **Free SOL**: Devnet SOL has no real value
- **Rate Limits**: Faucet has daily limits per IP
- **VPN Required**: Change VPN between cycles to avoid limits
- **Automatic**: Runs until target reached or manually stopped

