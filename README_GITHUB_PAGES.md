# GitHub Pages Deployment Guide

## Quick Setup

1. **Update `public/config.js`** with your vault and black mirror wallet addresses:
```javascript
const CONFIG = {
    VAULT_ADDRESS: 'YOUR_VAULT_ADDRESS',
    BLACK_MIRROR_ADDRESS: 'YOUR_BLACK_MIRROR_ADDRESS',
    API_URL: '', // Leave empty for static mode
    // ... other settings
};
```

2. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `public` folder
   - Save

4. **Your site will be live at**: `https://yourusername.github.io/pumpfun/`

## Features Enabled

✅ **Decoy Transactions**: Creates 3 fake transactions to obfuscate the real one
✅ **Merkle Tree Visualization**: Shows cryptographic proof tree
✅ **Account Closing Detection**: Checks if accounts can be closed after transfer
✅ **Static Mode**: Works without backend (for display only)

## Backend Required For

- Actual transaction routing (vault → black mirror → destination)
- Account closing operations
- Real-time balance checking

## Configuration

Edit `public/config.js` to customize:
- Decoy count and amounts
- Merkle tree depth
- API endpoint (if using backend)

## Notes

- Frontend works standalone for visualization
- Backend needed for actual transaction processing
- Update wallet addresses in config.js after generating wallets

