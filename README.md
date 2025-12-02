# Solana Privacy Transfer

A privacy-focused Solana transaction service that routes transfers through intermediate wallets to enhance anonymity.

## Features

- 🔒 **Privacy-Focused**: Routes transactions through intermediate wallets
- 👛 **Phantom Wallet Integration**: Easy wallet connection
- 🎨 **Modern UI**: Sleek, animated interface with privacy visualization
- ⚡ **Fast Processing**: Efficient transaction routing
- 🛡️ **Secure**: Multi-wallet architecture for enhanced privacy

## Setup

### Prerequisites

- Node.js 16+ installed
- Phantom wallet browser extension
- Solana wallet with funds for testing

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open `index.html` in your browser (or serve it through the server)

## Architecture

The service uses a two-wallet architecture:

1. **Vault Wallet**: Receives initial funds from the user
2. **Black Mirror Wallet**: Sends funds to the final destination

This routing helps obscure the direct connection between sender and receiver.

## Wallet Management

Wallets are automatically generated on first run and saved in the `wallets/` directory. You can import these wallets into Phantom for management:

- `wallets/vault.json` - Vault wallet keypair
- `wallets/blackmirror.json` - Black Mirror wallet keypair

**Important**: Keep these wallet files secure and never commit them to version control.

## Usage

1. Connect your Phantom wallet
2. Enter the destination address (Wallet B)
3. Enter the amount to transfer
4. Click "Send Anonymous Transfer"
5. Watch the privacy processing animation
6. Wait for confirmations
7. Transaction completes!

## Service Fee

A small service fee (0.01 SOL) is charged for each transaction to cover operational costs.

## Roadmap

- Zero-Knowledge Proofs integration
- Multi-chain support
- Enhanced speed optimizations
- Advanced security protocols

## Security Notes

- Always verify wallet addresses before sending
- Keep private keys secure
- Use testnet for development
- Review all transactions before confirming

## License

MIT

