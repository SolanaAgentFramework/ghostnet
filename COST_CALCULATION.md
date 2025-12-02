# 💰 Cost Calculation: Wallet A → Wallet B Transfer

## Complete Transaction Flow & Costs

### Transaction Path:
```
Wallet A → Vault → Black Mirror → Wallet B
```

## Cost Breakdown (Per Transaction)

### 1. **User Transaction Fees** (Paid by User)
- **User → Vault transaction**: ~0.000005 SOL (5,000 lamports)
- **Decoy transactions** (3 decoys): 3 × 0.000005 = **0.000015 SOL**
- **Subtotal User Fees**: **0.00002 SOL** (~$0.0003 at $15/SOL)

### 2. **Service Fees** (Paid by User)
- **Service fee**: 0.35% of transfer amount
- Example: 1 SOL transfer = **0.0035 SOL** (~$0.0525)
- Example: 0.1 SOL transfer = **0.00035 SOL** (~$0.00525)

### 3. **Backend Transaction Fees** (Paid by Service)
- **Vault → Black Mirror**: ~0.000005 SOL
- **Black Mirror → Wallet B**: ~0.000005 SOL
- **Subtotal Backend Fees**: **0.00001 SOL** (~$0.00015)

### 4. **Rent Exemption** (One-time, if creating accounts)
- **New account rent**: ~0.00089 SOL (if creating new accounts)
- **Note**: Vault and Black Mirror are permanent, so no rent needed per transaction

## Total Cost Examples

### Small Transfer (0.01 SOL):
```
Amount:           0.010000000 SOL
Service Fee:      0.000035000 SOL (0.35%)
User Tx Fees:     0.000020000 SOL (main + decoys)
Backend Tx Fees:  0.000010000 SOL (vault→mirror→dest)
─────────────────────────────────────────
Total User Pays:  0.010055000 SOL (~$0.15)
Service Pays:     0.000010000 SOL (~$0.00015)
```

### Medium Transfer (0.1 SOL):
```
Amount:           0.100000000 SOL
Service Fee:      0.000350000 SOL (0.35%)
User Tx Fees:     0.000020000 SOL
Backend Tx Fees:  0.000010000 SOL
─────────────────────────────────────────
Total User Pays:  0.100370000 SOL (~$1.51)
Service Pays:     0.000010000 SOL (~$0.00015)
```

### Large Transfer (1 SOL):
```
Amount:           1.000000000 SOL
Service Fee:      0.003500000 SOL (0.35%)
User Tx Fees:     0.000020000 SOL
Backend Tx Fees:  0.000010000 SOL
─────────────────────────────────────────
Total User Pays:  1.003520000 SOL (~$15.05)
Service Pays:     0.000010000 SOL (~$0.00015)
```

## Cost Summary

### Per Transaction:
- **Minimum cost**: ~0.00003 SOL (fees only, no amount)
- **User pays**: Amount + 0.35% + 0.00002 SOL
- **Service pays**: 0.00001 SOL (backend routing)
- **Service earns**: 0.35% of amount (minus backend fees)

### At Current SOL Price (~$15):
- **Small (0.01 SOL)**: User pays ~$0.15, Service earns ~$0.0005
- **Medium (0.1 SOL)**: User pays ~$1.51, Service earns ~$0.005
- **Large (1 SOL)**: User pays ~$15.05, Service earns ~$0.052

## Cost Optimization

### If Decoys Disabled:
- Save: 0.000015 SOL per transaction
- User pays: Amount + 0.35% + 0.000005 SOL

### If Using Intermediate Wallets (Future):
- Add: ~0.000005 SOL per intermediate wallet
- 3 intermediate wallets = +0.000015 SOL
- Total: ~0.00003 SOL additional

## Notes

1. **Black Mirror stays open** - No rent to reclaim from it
2. **Vault stays open** - Accumulates service fees
3. **Decoy costs are minimal** - Only transaction fees (~$0.0003)
4. **Service fee is main revenue** - 0.35% of all transfers
5. **Backend costs are tiny** - ~$0.00015 per transaction

## Break-Even Analysis

**Service needs to process**:
- ~200 transactions of 0.1 SOL to cover $0.10 in backend fees
- Or ~20 transactions of 1 SOL
- Service fee revenue: 0.35% covers backend costs easily

**Very profitable at scale!** 🚀

