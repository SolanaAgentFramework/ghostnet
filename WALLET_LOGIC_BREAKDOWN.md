# Wallet Logic & Transaction Routing - File Breakdown

## 📁 Main Backend File (Production)

### `server.js` (Root folder)
**This is THE MAIN FILE for all wallet logic, Black Mirror, and Ghost shards!**

#### Wallet Loading & Management (Lines ~25-90)
- **Location**: `server.js` lines 25-90
- **What it does**:
  - Loads/generates Vault wallet from `wallets/vault.json`
  - Loads/generates Black Mirror wallet from `wallets/blackmirror.json`
  - Creates Phantom-importable key files
  - Handles wallet rotation (vault rotation, black mirror rotation)

#### Black Mirror Logic (Lines ~140-335)
- **Location**: `server.js` lines 140-335
- **What it does**:
  - Selects Black Mirror wallet (static or rotated)
  - Receives funds from Vault
  - Validates Black Mirror balance
  - Prepares to route to Ghost shards or destination

#### Ghost Shard Logic (Lines ~336-445)
- **Location**: `server.js` lines 336-445
- **What it does**:
  - Generates ghost wallets (`Keypair.generate()`)
  - Routes: Black Mirror → Ghost1 → Ghost2 → Ghost3 → Destination
  - Handles rent reclamation from ghost wallets
  - Closes ghost wallets after use
  - Variable delays between hops

#### Key Configuration (Lines ~510-520)
- **Location**: `server.js` lines 510-520
- **Settings**:
  - `GHOST_DANCE_ENABLED = true`
  - `GHOST_SHARD_COUNT = 2` (or 3 for max anonymity)
  - `BLACK_MIRROR_ROTATION_ENABLED = true`
  - `VAULT_ROTATION_ENABLED = true`
  - `DYNAMIC_RENT_RECLAMATION = true`

---

## 📁 Wallet Storage

### `wallets/` folder
**Contains all wallet keypairs (JSON format)**

#### Files:
- `vault.json` - Vault wallet (receives user funds)
- `blackmirror.json` - Black Mirror wallet (routes to ghosts)
- `master.json` - Master wallet (for funding/testing)
- `*-phantom.txt` - Phantom-importable keys (base58 format)

---

## 📁 Test/Utility Scripts

### `test_20_users.js` (Root folder)
**Test script with full wallet logic**
- **Lines 112-113**: Loads vault and black mirror wallets
- **Lines 136-145**: Vault → Black Mirror transfer
- **Lines 159-207**: Ghost shard routing (3 ghosts)
- **Lines 209-230**: Rent reclamation from ghosts

### `test_concurrent_users.js` (Root folder)
**Concurrent transaction testing**
- **Lines 98-223**: Full transaction flow with vault/black mirror/ghosts
- Handles multiple users sending simultaneously

### `test_single_transfer.js` (Root folder)
**Single transaction test**
- **Lines 54-189**: Complete flow with detailed logging
- Shows all transaction links

### `process_stuck_transaction.js` (Root folder)
**Manual processing tool**
- **Lines 23-132**: Manually routes stuck funds
- Vault → Black Mirror → Ghosts → Destination

---

## 📁 Frontend Files

### `public/app.js`
**Frontend wallet connection (Phantom)**
- **Lines 156-163**: Connects to Phantom wallet
- **Lines 234**: Sends to Vault address
- **Lines 258-284**: Calls backend API with transaction details
- **Does NOT handle Black Mirror or Ghosts** (that's backend only!)

### `public/config.js`
**Configuration**
- `VAULT_ADDRESS`: Where frontend sends funds
- `BLACK_MIRROR_ADDRESS`: Display only
- `API_URL`: Backend endpoint

---

## 🔑 Key Functions by Responsibility

### Wallet Loading
```javascript
// server.js lines 30-80
- Loads vault from wallets/vault.json
- Loads black mirror from wallets/blackmirror.json
- Generates new wallets if missing
```

### Black Mirror Routing
```javascript
// server.js lines 245-313
- Vault → Black Mirror transfer
- Validates balance
- Adds memo noise (optional)
```

### Ghost Shard Generation & Routing
```javascript
// server.js lines 340-445
- Generates ghost wallets (Keypair.generate())
- Routes: Black Mirror → Ghost1 → Ghost2 → Ghost3 → Destination
- Closes ghosts and reclaims rent
```

### Transaction Flow
```
1. Frontend (app.js) → Sends to Vault
2. Backend (server.js) → Receives API call
3. Backend → Vault → Black Mirror
4. Backend → Black Mirror → Ghost1 → Ghost2 → Ghost3 → Destination
```

---

## 📊 Summary

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| **Wallet Loading** | `server.js` | 25-90 | Load vault/black mirror keys |
| **Black Mirror** | `server.js` | 245-335 | Route from vault to black mirror |
| **Ghost Shards** | `server.js` | 336-445 | Generate and route through ghosts |
| **Wallet Storage** | `wallets/*.json` | - | Store private keys |
| **Frontend** | `public/app.js` | 234-284 | Send to vault, call backend |
| **Config** | `public/config.js` | - | Vault/API addresses |

---

## ⚠️ IMPORTANT

**ALL production wallet logic is in `server.js`!**

- Ghost shards are generated on-the-fly (not stored)
- Black Mirror can be static or rotated
- Vault can be static or rotated
- All routing happens in `server.js` `/api/transfer` endpoint

