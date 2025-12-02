// Script to request 5 SOL airdrop from devnet faucet
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

async function requestAirdrop(walletPubkey, amountSOL, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`💰 Requesting ${amountSOL} SOL airdrop to ${walletPubkey.toString()}... (Attempt ${attempt}/${retries})`);
            
            // Request airdrop (5 SOL = 5 * LAMPORTS_PER_SOL)
            const signature = await connection.requestAirdrop(
                walletPubkey,
                amountSOL * LAMPORTS_PER_SOL
            );
            
            console.log(`⏳ Airdrop transaction: ${signature}`);
            console.log(`   Waiting for confirmation...`);
            
            // Wait for confirmation with longer timeout
            await connection.confirmTransaction(signature, 'confirmed');
            
            const balance = await connection.getBalance(walletPubkey);
            console.log(`✅ Airdrop confirmed!`);
            console.log(`   New balance: ${(balance / LAMPORTS_PER_SOL).toFixed(9)} SOL`);
            console.log(`   Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet\n`);
            
            return signature;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error.message);
            if (attempt < retries) {
                const waitTime = attempt * 2000; // 2s, 4s, 6s
                console.log(`   Retrying in ${waitTime/1000} seconds...\n`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                throw error;
            }
        }
    }
}

async function airdropAllWallets() {
    try {
        const WALLETS_DIR = path.join(__dirname, 'wallets');
        const vaultPath = path.join(__dirname, 'wallets', 'vault.json');
        const blackMirrorPath = path.join(__dirname, 'wallets', 'blackmirror.json');
        
        console.log('🚀 Devnet Airdrop - Requesting 5 SOL for each wallet\n');
        
        // Load vault wallet
        if (fs.existsSync(vaultPath)) {
            const vaultData = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
            const vaultKeypair = Keypair.fromSecretKey(bs58.decode(vaultData.secretKey));
            const vaultPubkey = vaultKeypair.publicKey;
            
            console.log('📦 Vault Wallet:', vaultPubkey.toString());
            const vaultBalance = await connection.getBalance(vaultPubkey);
            console.log(`   Current balance: ${(vaultBalance / LAMPORTS_PER_SOL).toFixed(9)} SOL`);
            
            await requestAirdrop(vaultPubkey, 5);
            
            // Wait a bit between requests to avoid rate limits
            console.log('⏸️  Waiting 5 seconds before next request...\n');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            console.log('⚠️  Vault wallet not found');
        }
        
        // Load black mirror wallet
        if (fs.existsSync(blackMirrorPath)) {
            const blackMirrorData = JSON.parse(fs.readFileSync(blackMirrorPath, 'utf8'));
            const blackMirrorKeypair = Keypair.fromSecretKey(bs58.decode(blackMirrorData.secretKey));
            const blackMirrorPubkey = blackMirrorKeypair.publicKey;
            
            console.log('🪞 Black Mirror Wallet:', blackMirrorPubkey.toString());
            const blackMirrorBalance = await connection.getBalance(blackMirrorPubkey);
            console.log(`   Current balance: ${(blackMirrorBalance / LAMPORTS_PER_SOL).toFixed(9)} SOL`);
            
            await requestAirdrop(blackMirrorPubkey, 5);
        } else {
            console.log('⚠️  Black Mirror wallet not found');
        }
        
        console.log('✅ All airdrops complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

airdropAllWallets();

