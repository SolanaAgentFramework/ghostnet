# 💸 Service Provider Costs (What YOU Pay)

## Exact Costs Per Transaction

### Current Setup (Vault → Black Mirror → Destination):

**Service Provider Pays:**
1. **Vault → Black Mirror transaction**: 0.000005 SOL (5,000 lamports)
2. **Black Mirror → Destination transaction**: 0.000005 SOL (5,000 lamports)
3. **Total Service Cost**: **0.00001 SOL** (~$0.00015 at $15/SOL)

### User Pays:
- Their transaction to vault: 0.000005 SOL
- Decoy transactions: 0.000015 SOL (3 decoys × 0.000005)
- Service fee: 0.35% of amount

---

## Revenue vs Cost Analysis

### Small Transaction (0.01 SOL):
- **Service Fee Revenue**: 0.01 × 0.0035 = **0.000035 SOL** (~$0.000525)
- **Service Cost**: **0.00001 SOL** (~$0.00015)
- **Profit**: 0.000025 SOL (~$0.000375) ✅ **PROFITABLE**

### Very Small Transaction (0.001 SOL):
- **Service Fee Revenue**: 0.001 × 0.0035 = **0.0000035 SOL** (~$0.0000525)
- **Service Cost**: **0.00001 SOL** (~$0.00015)
- **Profit**: -0.0000065 SOL (~-$0.0000975) ❌ **LOSS**

### Medium Transaction (0.1 SOL):
- **Service Fee Revenue**: 0.1 × 0.0035 = **0.00035 SOL** (~$0.00525)
- **Service Cost**: **0.00001 SOL** (~$0.00015)
- **Profit**: 0.00034 SOL (~$0.0051) ✅ **PROFITABLE**

### Large Transaction (1 SOL):
- **Service Fee Revenue**: 1 × 0.0035 = **0.0035 SOL** (~$0.0525)
- **Service Cost**: **0.00001 SOL** (~$0.00015)
- **Profit**: 0.00349 SOL (~$0.05235) ✅ **VERY PROFITABLE**

---

## If Adding Shards/Intermediate Wallets

### With 3 Intermediate Wallets (Vault → Shard1 → Shard2 → Shard3 → Black Mirror → Dest):
- **Transaction 1**: Vault → Shard1 = 0.000005 SOL
- **Transaction 2**: Shard1 → Shard2 = 0.000005 SOL
- **Transaction 3**: Shard2 → Shard3 = 0.000005 SOL
- **Transaction 4**: Shard3 → Black Mirror = 0.000005 SOL
- **Transaction 5**: Black Mirror → Destination = 0.000005 SOL
- **Total Service Cost**: **0.000025 SOL** (~$0.000375)

### With 5 Intermediate Wallets:
- **Total Service Cost**: **0.000035 SOL** (~$0.000525)

---

## Break-Even Analysis

### Current Setup (2 transactions):
- **Break-even**: 0.00001 SOL ÷ 0.0035 = **0.002857 SOL** (~$0.043)
- **Minimum profitable amount**: **~0.003 SOL** or more

### With 3 Shards (5 transactions):
- **Break-even**: 0.000025 SOL ÷ 0.0035 = **0.007143 SOL** (~$0.107)
- **Minimum profitable amount**: **~0.008 SOL** or more

### With 5 Shards (7 transactions):
- **Break-even**: 0.000035 SOL ÷ 0.0035 = **0.01 SOL** (~$0.15)
- **Minimum profitable amount**: **~0.01 SOL** or more

---

## Recommendations

### Option 1: Keep Current (2 transactions)
- **Cost**: 0.00001 SOL per transaction
- **Break-even**: ~0.003 SOL
- **Best for**: All transactions above 0.003 SOL

### Option 2: Add Minimum Amount
- Set minimum transfer: **0.01 SOL**
- Ensures service fee covers costs
- Prevents losses on tiny transactions

### Option 3: Add 2-3 Shards for More Privacy
- **Cost**: 0.00002-0.000025 SOL per transaction
- **Break-even**: ~0.006-0.008 SOL
- **Better privacy**, slightly higher cost

### Option 4: Dynamic Fee Structure
- Small amounts (< 0.01 SOL): Higher fee (0.5-1%)
- Normal amounts: 0.35% fee
- Large amounts (> 1 SOL): Lower fee (0.25%)

---

## Bottom Line

**Current Service Cost**: **0.00001 SOL** per transaction

**You need transactions of at least 0.003 SOL to break even.**

**Recommendation**: Add minimum transfer amount of **0.01 SOL** to ensure profitability on all transactions.

