# Black Box Recovery System - Crash-Safe Key Archiving

## 🎯 What is the Black Box System?

The Black Box system saves **every private key to disk BEFORE it receives funds**. This makes the system **100% crash-safe** - if your server crashes mid-transaction, you can recover all funds.

## 📂 Archive Location

All keys are saved to: `wallets/archive_log/`

## 🔑 What Gets Archived?

1. **Static Vault** - Main vault wallet (loaded on startup)
2. **Static Black Mirror** - Main black mirror wallet (loaded on startup)
3. **Rotated Vaults** - New vault wallets generated for each transaction
4. **Rotated Black Mirrors** - New black mirror wallets generated for each transaction
5. **Ghost Shards** - All intermediate ghost wallets used in routing

## 📄 File Format

Files are named: `YYYY-MM-DDTHH-MM-SS-sss_ROLE_txID_PubKey.json`

Example: `2025-01-12T23-45-30-123_GHOST_SHARD_1_tx2b92hG7g_Ab3dEf12.json`

Each file contains:
```json
{
  "role": "GHOST_SHARD_1",
  "publicKey": "Ab3dEf12...",
  "secretKey": "2RKof6wN...",
  "created": "2025-01-12T23:45:30.123Z",
  "transactionId": "2b92hG7g..."
}
```

## 🔄 How Recovery Works

### If Server Crashes Mid-Transaction:

1. **Find the latest transaction:**
   - Check backend logs for the last transaction ID
   - Or check Solscan for recent transactions from your vault

2. **Search archive folder:**
   - Look for files with that transaction ID
   - Files will be named: `*_tx[ID]_*.json`

3. **Import to Phantom:**
   - Open the JSON file
   - Copy the `secretKey` (base58 format)
   - Import into Phantom Wallet
   - Your funds will be there!

### Example Recovery:

```bash
# 1. Find latest ghost wallet
cd wallets/archive_log
ls -lt | head -5

# 2. Open the latest file
cat 2025-01-12T23-45-30-123_GHOST_SHARD_2_tx2b92hG7g_Ab3dEf12.json

# 3. Copy the secretKey
# 4. Import to Phantom Wallet
```

## ⚠️ Security Warning

**The archive folder contains PRIVATE KEYS!**

- ✅ **Safe for localhost:** Your local machine is behind your router's NAT
- ❌ **NOT safe for public servers:** Don't host this on a public VPS without encryption
- 🔒 **Best practice:** Encrypt the archive folder or use a secure backup

## 🛡️ Security Recommendations

1. **Encrypt the archive folder:**
   ```bash
   # Use Windows BitLocker or similar
   # Or encrypt individual files
   ```

2. **Backup to secure location:**
   - Encrypted cloud storage (with client-side encryption)
   - External encrypted drive
   - Never store unencrypted on public servers

3. **Access control:**
   - Restrict file permissions (Windows: Right-click → Properties → Security)
   - Only allow your user account to read/write

## 📊 Archive Management

### View All Archived Keys:
```bash
cd wallets/archive_log
ls -la
```

### Find Keys by Transaction:
```bash
# Find all keys for a specific transaction
grep -l "tx2b92hG7g" *.json
```

### Find Keys by Role:
```bash
# Find all ghost shards
ls *_GHOST_SHARD_*.json

# Find all rotated vaults
ls *_ROTATED_VAULT_*.json
```

### Cleanup Old Keys (Optional):
```bash
# Delete keys older than 30 days (after verifying funds are safe)
find . -name "*.json" -mtime +30 -delete
```

## ✅ Benefits

1. **Crash-Safe:** Keys saved before funds arrive
2. **Recoverable:** 100% fund recovery possible
3. **Auditable:** Complete transaction history
4. **Debuggable:** Easy to trace which wallet was used

## 🚨 Important Notes

- Keys are saved **synchronously** (blocking) to ensure they're on disk before funds arrive
- Archive folder grows over time - consider periodic cleanup of old keys
- Never share the archive folder or commit it to Git!

