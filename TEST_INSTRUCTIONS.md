# 🧪 Test Scripts Instructions

## Prerequisites

**Fund your wallets first:**
- Vault: `JChojPahR9scTF63ETisQ6YGTuhkq5B1Ud9w1XkanyRT`
  - Visit: https://faucet.solana.com/?address=JChojPahR9scTF63ETisQ6YGTuhkq5B1Ud9w1XkanyRT
  - Request 5 SOL

- Black Mirror: `DeN4LPaUCUwYHfAeVAHh3gzYtpg93HHHA7BYEtBrGbxC`
  - Visit: https://faucet.solana.com/?address=DeN4LPaUCUwYHfAeVAHh3gzYtpg93HHHA7BYEtBrGbxC
  - Request 5 SOL

---

## Test 1: Single Transaction (Max Non-Concurrent)

**Run:**
```bash
node test_single_tx.js
```

**What it does:**
1. Sends random amount (0.01-0.03 SOL) from sender to temp vault
2. Routes through: Temp Vault → Black Mirror → Ghost 1 → Ghost 2 → Receiver
3. Reclaims rent from ghost wallets
4. Provides Solscan links for all transactions

**Output includes:**
- Sender wallet link
- Receiver wallet link
- All transaction links (5 steps)
- Final balance

---

## Test 2: 10 Users Simulation

### Sequential Mode (One at a time)
```bash
node test_10_users.js sequential
```

### Concurrent Mode (All at once)
```bash
node test_10_users.js concurrent
```

**What it does:**
1. Generates 10 random amounts (0.01-0.03 SOL each)
2. Creates 10 receiver wallets
3. Processes each through full anonymity circle:
   - Sender → Temp Vault → Black Mirror → Ghost 1 → Ghost 2 → Receiver
4. Reclaims rent from all ghost wallets
5. Provides Solscan links for all transactions

**Sequential Mode:**
- Processes one transaction at a time
- Easier to track
- Slower but more reliable

**Concurrent Mode:**
- Sends all 10 transactions at once
- Tests system under load
- Faster but may hit rate limits

---

## Expected Output Format

### Single Transaction:
```
📤 Step 1: Sender → Temp Vault
✅ [transaction_signature]
   🔗 https://solscan.io/tx/[sig]?cluster=devnet
   From: [sender_address]
   To: [receiver_address]
   Amount: 0.012345 SOL
```

### 10 Users:
```
📋 Transaction Plan:
   1. 0.012345 SOL → [receiver]...
   2. 0.023456 SOL → [receiver]...
   ...

📊 Test Summary:
   Total Transactions: 10
   Mode: concurrent/sequential

🔗 Transaction Links:
   Transaction 1:
   Receiver: [address]
   Amount: 0.012345 SOL
   Vault→Mirror: https://solscan.io/tx/[sig]?cluster=devnet
   Mirror→Ghost1: https://solscan.io/tx/[sig]?cluster=devnet
   Ghost1→Ghost2: https://solscan.io/tx/[sig]?cluster=devnet
   Ghost2→Receiver: https://solscan.io/tx/[sig]?cluster=devnet
```

---

## Full Anonymity Circle Flow

Each transaction follows this path:

1. **User Deposit** → Temp Vault (simulated)
2. **Temp Vault** → Black Mirror (with 0.35% service fee)
3. **Black Mirror** → Ghost 1 (first shard)
4. **Ghost 1** → Ghost 2 (second shard)
5. **Ghost 2** → Final Receiver
6. **Rent Reclamation** → Ghost wallets closed, rent sent to main wallet

**Main Wallet:** `94GP9qX5hRGwuRJJg3zdMC9pwHwDSaVkpxPSXdZAiDtF`

---

## Notes

- All transactions use **devnet**
- Solscan links use `?cluster=devnet` parameter
- Rent reclamation happens automatically after each transaction
- Service fee: 0.35% deducted at Vault → Black Mirror step
- Transaction fees: ~0.000005 SOL per hop (5 hops total)

---

## Troubleshooting

**"Insufficient wallet balance"**
- Fund wallets using faucet links above

**"429 Too Many Requests"**
- Wait a few minutes between test runs
- Use sequential mode instead of concurrent

**"Transaction failed"**
- Check wallet balances
- Verify devnet is accessible
- Check Solscan for transaction status

