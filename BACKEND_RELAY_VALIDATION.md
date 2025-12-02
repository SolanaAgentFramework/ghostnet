# Backend Relay Validation - Critical Checks

## ✅ All Critical Checks Now Implemented

### 1. **Vault Key Verification** ✅
**Location**: `server.js` lines ~150-170

**What it checks**:
- Verifies backend has the private key for the vault address that received funds
- Compares `vaultAddress` from frontend with backend's `currentVaultWallet.publicKey`
- **Fails fast** if keys don't match (prevents silent failures)

**Error Message**:
```
Vault key mismatch! Frontend sent funds to {address}, but backend only has key for {address}. Cannot relay funds.
```

---

### 2. **Vault Balance Check** ✅
**Location**: `server.js` lines ~260-285

**What it checks**:
- Verifies vault received the funds (waits for confirmation)
- Checks vault has enough SOL to send + pay gas fees
- Warns if gas reserve is low

**Error Message**:
```
Insufficient funds in vault. Need {X} SOL to send {Y} SOL, but vault has {Z} SOL. Please wait for vault transaction to confirm.
```

---

### 3. **Gas Fee Validation** ✅
**Location**: `server.js` lines ~270-280

**What it checks**:
- Minimum gas reserve: 0.00001 SOL
- Warns if vault is running low on gas
- Ensures vault can pay for transaction fees

---

### 4. **Keypair Validation** ✅
**Location**: `server.js` lines ~307-312

**What it checks**:
- Verifies vault keypair exists and is valid
- Ensures `secretKey` is present before signing
- Prevents signing failures

**Error Message**:
```
Backend vault wallet keypair is invalid. Cannot sign transaction.
```

---

### 5. **Transaction Confirmation Wait** ✅
**Location**: `server.js` lines ~193-210

**What it does**:
- Waits up to 10 seconds for vault transaction to confirm
- Retries checking transaction status
- Prevents processing before funds arrive

---

## 🔍 Debugging Checklist

If funds are stuck in vault, check:

1. **Backend has the key?**
   - Check `wallets/vault.json` exists
   - Verify public key matches `CONFIG.VAULT_ADDRESS`
   - Backend logs: `✅ Vault key verified: {address}`

2. **Vault has gas?**
   - Minimum: 0.00001 SOL for gas reserve
   - Recommended: 0.1 SOL for multiple transactions
   - Check: `💰 Vault Balance Check:` in backend logs

3. **Transaction confirmed?**
   - Backend waits up to 10 seconds
   - Check: `✅ Vault transaction confirmed` in logs
   - Verify on Solscan: `https://solscan.io/tx/{vaultTx}?cluster=devnet`

4. **CORS enabled?**
   - Backend has: `app.use(cors({ origin: '*' }))`
   - Frontend can reach backend API

5. **Backend running?**
   - Check: `http://localhost:3000/api/health`
   - Should return: `{ status: 'ok', vaultAddress: '...', blackMirrorAddress: '...' }`

---

## 📊 Error Flow

```
Frontend → Vault (✅ Works)
    ↓
Backend receives API call
    ↓
Check 1: Vault key matches? → ❌ → Error: "Vault key mismatch"
    ↓ ✅
Check 2: Vault TX confirmed? → ❌ → Error: "Vault transaction not confirmed"
    ↓ ✅
Check 3: Vault has balance? → ❌ → Error: "Insufficient funds in vault"
    ↓ ✅
Check 4: Vault has gas? → ⚠️ → Warning (continues)
    ↓ ✅
Check 5: Keypair valid? → ❌ → Error: "Backend vault wallet keypair is invalid"
    ↓ ✅
Sign & Send: Vault → Black Mirror → Ghosts → Destination
```

---

## 🚀 Quick Fixes

### If "Vault key mismatch":
```bash
# Check vault address matches
node -e "const fs=require('fs'); const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const data=JSON.parse(fs.readFileSync('wallets/vault.json')); const kp=Keypair.fromSecretKey(bs58.decode(data.secretKey)); console.log('Vault address:', kp.publicKey.toString());"
```

### If "Insufficient funds":
```bash
# Check vault balance
node -e "const {Connection, PublicKey}=require('@solana/web3.js'); const conn=new Connection('https://api.devnet.solana.com'); const vault=new PublicKey('JChojPahR9scTF63ETisQ6YGTuhkq5B1Ud9w1XkanyRT'); conn.getBalance(vault).then(b=>console.log('Balance:', b/1e9, 'SOL'));"
```

### If "Backend not responding":
```bash
# Test backend health
curl http://localhost:3000/api/health
```

---

## ✅ All Checks Pass = Funds Relay Successfully!

