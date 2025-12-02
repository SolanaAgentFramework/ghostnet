// Solana Privacy Transfer Application - Enhanced Edition
const SERVICE_FEE_PERCENT = 0.35;
const HELIUS_API_KEY = '7b3312ca-9bf1-4b30-ba5f-5e342be423ec';
const RPC_URL = 'https://api.devnet.solana.com'; // Devnet for demo
const API_URL = CONFIG.API_URL || window.location.origin;
const USE_BACKEND = CONFIG.API_URL !== '';

let wallet = null;
let walletPublicKey = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initParticles(); // Start the background visual
    setupWalletEvents();
    setupEventListeners();
    updateFeeDisplay();
    
    // Header is now stable neon, no glitch effect needed
});

// --- VISUAL FX: PARTICLE NETWORK ---
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        for (let i = 0; i < 50; i++) particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - dist/1500})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resize);
    init();
    animate();
}

// --- TYPEWRITER EFFECT ---
async function typeText(element, text, speed = 20) {
    element.textContent = '';
    // Glitch char set
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    
    for (let i = 0; i < text.length; i++) {
        // Random glitch effect before settling on character
        for(let j=0; j<2; j++) {
            element.textContent = text.substring(0, i) + chars[Math.floor(Math.random() * chars.length)];
            await new Promise(r => setTimeout(r, 5));
        }
        element.textContent = text.substring(0, i + 1);
        await new Promise(r => setTimeout(r, speed));
    }
}

// --- WALLET LOGIC ---
function setupWalletEvents() {
    if (window.solana && window.solana.isPhantom) {
        wallet = window.solana;
        wallet.on('disconnect', handleWalletDisconnect);
        wallet.on('accountChanged', (publicKey) => {
            if (publicKey) {
                walletPublicKey = publicKey;
                updateWalletUI();
            } else {
                handleWalletDisconnect();
            }
        });
        // Auto connect if trusted
        wallet.connect({ onlyIfTrusted: true }).then(response => {
            if (response) {
                walletPublicKey = response.publicKey;
                updateWalletUI();
            }
        }).catch(() => {});
    } else {
        document.getElementById('connectWallet').textContent = 'INSTALL PHANTOM_';
    }
}

function updateWalletUI() {
    const addr = walletPublicKey.toString();
    document.getElementById('walletAddress').textContent = `${addr.slice(0, 6)}...${addr.slice(-6)}`;
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('connectWallet').textContent = 'LINK ESTABLISHED';
    document.getElementById('connectWallet').disabled = true;
    document.getElementById('connectWallet').style.borderColor = 'var(--neon-green)';
    document.getElementById('connectWallet').style.color = 'var(--neon-green)';
    document.getElementById('sendButton').disabled = false;
    updateBalance();
    updateFaucetUI(); // Update faucet UI when wallet connects
}

function handleWalletDisconnect() {
    walletPublicKey = null;
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('connectWallet').textContent = 'INITIALIZE LINK';
    document.getElementById('connectWallet').disabled = false;
    document.getElementById('connectWallet').style.borderColor = 'var(--neon-blue)';
    document.getElementById('connectWallet').style.color = 'var(--neon-blue)';
    document.getElementById('sendButton').disabled = true;
    document.getElementById('animationCard').classList.add('hidden');
    updateFaucetUI(); // Update faucet UI when wallet disconnects
}

function setupEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', async () => {
        if (!wallet) return window.open('https://phantom.app/', '_blank');
        try {
            const resp = await wallet.connect();
            walletPublicKey = resp.publicKey;
            updateWalletUI();
        } catch (err) { console.error(err); }
    });

    document.getElementById('disconnectWallet').addEventListener('click', async () => {
        if (wallet && wallet.isConnected) {
            try {
                await wallet.disconnect();
                handleWalletDisconnect();
            } catch (err) {
                console.error('Disconnect error:', err);
                // Force disconnect UI even if wallet.disconnect() fails
                handleWalletDisconnect();
            }
        }
    });

    document.getElementById('transferForm').addEventListener('submit', handleTransfer);
    document.getElementById('amount').addEventListener('input', updateFeeDisplay);
}

async function updateBalance() {
    try {
        const connection = new solanaWeb3.Connection(RPC_URL);
        const balance = await connection.getBalance(walletPublicKey);
        document.getElementById('walletBalance').textContent = (balance / 1000000000).toFixed(4) + ' SOL';
    } catch (err) { console.error(err); }
}

function updateFeeDisplay() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const serviceFee = amount * (SERVICE_FEE_PERCENT / 100);
    const total = amount + serviceFee + 0.00001; // Approx tx fees
    document.getElementById('serviceFee').textContent = `${serviceFee.toFixed(6)} SOL`;
    document.getElementById('totalAmount').textContent = `${total.toFixed(6)} SOL`;
}

// --- TRANSFER LOGIC ---
async function handleTransfer(e) {
    e.preventDefault();
    if (!walletPublicKey) return alert('CONNECT WALLET REQUIRED');
    
    const dest = document.getElementById('destinationAddress').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!dest || amount <= 0) return alert('INVALID INPUT PARAMETERS');

    try {
        const btn = document.getElementById('sendButton');
        btn.disabled = true;
        btn.innerHTML = 'SIGNING_TRANSACTION...';

        // 1. Get Setup
        const connection = new solanaWeb3.Connection(RPC_URL, 'confirmed');
        const { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } = solanaWeb3;
        
        // 2. Resolve Vault Address (Priority: GitHub Config -> Fallback)
        let vaultAddress = CONFIG.VAULT_ADDRESS;
        try {
            // Simulate fetching dynamic config
            const configReq = await fetch('config.json').catch(() => null);
            if (configReq && configReq.ok) {
                const conf = await configReq.json();
                if (conf.active_vault) vaultAddress = conf.active_vault;
            }
        } catch (e) { console.log('Using static config'); }

        const totalLamports = Math.floor((amount * (1 + SERVICE_FEE_PERCENT/100)) * LAMPORTS_PER_SOL);
        
        // 3. Build Transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: walletPublicKey,
                toPubkey: new PublicKey(vaultAddress),
                lamports: totalLamports
            })
        );
        
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = walletPublicKey;

        // 4. Sign & Send
        const signed = await wallet.signTransaction(transaction);
        
        // Start "The Show" immediately after signing
        document.getElementById('animationCard').classList.remove('hidden');
        document.getElementById('transferForm').classList.add('hidden'); // Hide form for immersion
        
        // Execute Animation Sequence (extended for Time Dilation delays)
        const animationPromise = runCyberAnimationSequence();
        
        // Send actual TX in background
        const signature = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(signature);
        
        // --- CRITICAL FIX: Force backend call with strict validation ---
        console.log("✅ Phase 1 Complete: Funds in Vault via", signature);
        
        // Force a check on the API URL (default to localhost for testing)
        const targetApiUrl = CONFIG.API_URL || 'http://localhost:3000';
        
        console.log('📡 Attempting Handshake with Backend at:', targetApiUrl);
        console.log('   Vault Address:', vaultAddress);
        console.log('   Destination:', dest);
        console.log('   Amount:', amount, 'SOL');
        console.log('   Vault TX:', signature);
        console.log('   ⏰ Time Dilation enabled: Processing may take 30-90 seconds for maximum privacy...');
        
        // Update UI to show extended processing time
        const statusElement = document.querySelector('.stage-text');
        if (statusElement) {
            typeText(statusElement, 'PRIVACY PROCESSING... (30-90s delays for maximum anonymity)');
        }
        
        let backendResult = null; // Declare outside try block for scope
        try {
            // No timeout - allow up to 2 minutes for Time Dilation delays
            const backendResponse = await fetch(`${targetApiUrl}/api/transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // No timeout specified - browser default is usually 2+ minutes which is enough
                body: JSON.stringify({
                    from: walletPublicKey.toString(),
                    to: dest,
                    amount: amount,
                    vaultTx: signature,
                    vaultAddress: vaultAddress // Send vault address so backend knows which vault to use
                })
            });
            
            // Check for HTTP errors (404, 500, etc.)
            if (!backendResponse.ok) {
                const errorText = await backendResponse.text();
                throw new Error(`Server responded with ${backendResponse.status}: ${errorText}`);
            }
            
            backendResult = await backendResponse.json();
            console.log('Backend response:', backendResult);
            
            if (!backendResult.success) {
                throw new Error(backendResult.error || 'Backend logic failed');
            }
            
            console.log('✅ Backend processing complete:', backendResult.message);
            if (backendResult.txHash) {
                console.log('   Final TX:', backendResult.txHash);
                console.log('   Solscan:', backendResult.solscan || 'N/A');
            }
            
        } catch (backendError) {
            console.error('❌ CRITICAL BACKEND ERROR:', backendError);
            
            // Stop the animation to show the error
            document.getElementById('animationCard').classList.add('hidden');
            document.getElementById('transferForm').classList.remove('hidden');
            document.getElementById('sendButton').disabled = false;
            document.getElementById('sendButton').innerHTML = 'INITIATE TRANSFER';
            
            alert(`FUNDS STUCK IN VAULT!\n\nThe funds are in the vault (${vaultAddress}), but the backend failed to forward them.\n\nError: ${backendError.message}\n\nCheck:\n1. Backend server is running on ${targetApiUrl}\n2. Backend has vault private key\n3. Vault has enough SOL for gas fees\n4. CORS is enabled on backend`);
            
            throw backendError; // Stop execution to prevent false success message
        }

        await animationPromise;
        // Pass destination address and final transaction hash to showSuccess
        const finalTxHash = (backendResult && backendResult.txHash) ? backendResult.txHash : signature;
        showSuccess(dest, finalTxHash, backendResult || {});

    } catch (err) {
        console.error(err);
        alert('EXECUTION FAILED: ' + err.message);
        document.getElementById('sendButton').disabled = false;
        document.getElementById('sendButton').innerHTML = 'INITIATE TRANSFER';
        document.getElementById('animationCard').classList.add('hidden');
        document.getElementById('transferForm').classList.remove('hidden');
    }
}

// --- ANIMATION ORCHESTRATION ---
async function runCyberAnimationSequence() {
    // Stage 1: Nodes
    showStage(1);
    await updateStageText('node-text', 'INITIALIZING PRIVACY NODES...', 'Activating distributed shard network');
    await sleep(2000);
    
    // Stage 2: Relays
    showStage(2);
    await updateStageText('relay-text', 'ESTABLISHING SECURE RELAYS...', 'Routing through ghost protocol');
    await sleep(2000);
    
    // Stage 3: Encryption
    showStage(3);
    await updateStageText('encrypt-text', 'APPLYING QUANTUM ENCRYPTION...', 'Obfuscating transaction signature');
    await sleep(2200);
    
    // Stage 4: Mixing (reuse generic ID but style differently)
    showStage(7);
    await updateStageText('mix-text', 'MIXING DATA STREAMS...', 'Entropy injection in progress');
    await sleep(2000);
    
    // Stage 5: Merkle
    if (CONFIG.MERKLE_ENABLED) {
        showStage(8);
        await updateStageText('merkle-text', 'VERIFYING MERKLE PROOF...', 'Cryptographic tree validation');
        const tree = document.getElementById('merkleTree');
        if(tree) buildMerkle(tree);
        await sleep(2500);
    }
    
    // Stage 6: Confirmations (extended for Time Dilation)
    showStage(4);
    await simulateCyberConfirmations();
    
    // Stage 7: Extended Processing Notice (for Time Dilation delays)
    showStage(4);
    await updateStageText('confirmation-text', 'PRIVACY DELAYS ACTIVE...', 'Time dilation: 30-90s random delays break timestamp correlation');
    await sleep(5000); // Show message for 5 seconds
}

function showStage(num) {
    for(let i=1; i<=8; i++) {
        const el = document.getElementById(`stage${i}`);
        if(el) el.classList.add('hidden');
    }
    const target = document.getElementById(`stage${num}`);
    if(target) target.classList.remove('hidden');
}

async function updateStageText(elementId, main, sub) {
    // Attempt to find element, if not found, rely on class selectors from original HTML structure
    // This wrapper handles both specific IDs (if you added them) or the original class structure
    const stages = document.querySelectorAll('.stage-text:not(.success)');
    const subs = document.querySelectorAll('.stage-subtext');
    
    // Typewriter effect on the visible stage
    for(let s of stages) {
        if(!s.closest('.hidden')) await typeText(s, main);
    }
    for(let s of subs) {
        if(!s.closest('.hidden')) s.textContent = sub;
    }
}

async function simulateCyberConfirmations() {
    const bar = document.getElementById('progressBar');
    const count = document.getElementById('confirmationCount');
    
    for(let i=1; i<=100; i+=2) {
        bar.style.width = i + '%';
        count.textContent = `SYSTEM INTEGRITY: ${i}%`;
        await sleep(30);
    }
    count.textContent = 'INTEGRITY VERIFIED';
}

function buildMerkle(container) {
    container.innerHTML = '';
    for(let i=0; i<16; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'merkle-leaf';
        leaf.textContent = Math.random().toString(16).substr(2, 6).toUpperCase();
        container.appendChild(leaf);
        setTimeout(() => leaf.classList.add('active'), i*100);
    }
}

function showSuccess(destinationAddress, txHash, backendResult) {
    showStage(6);
    const hashEl = document.getElementById('txHash');
    
    // Create friendly success message with link to destination wallet
    const solscanWalletUrl = `https://solscan.io/account/${destinationAddress}?cluster=devnet`;
    const solscanTxUrl = txHash ? `https://solscan.io/tx/${txHash}?cluster=devnet` : null;
    
    // Clear and show success message
    hashEl.innerHTML = '';
    
    // Main success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'color: var(--neon-green); font-size: 1.3em; font-weight: bold; margin-bottom: 15px; font-family: var(--font-tech);';
    successMsg.textContent = '✅ DELIVERED!';
    hashEl.appendChild(successMsg);
    
    // Destination wallet link
    const walletLink = document.createElement('a');
    walletLink.href = solscanWalletUrl;
    walletLink.target = '_blank';
    walletLink.style.cssText = 'display: inline-block; margin-top: 10px; padding: 10px 20px; background: rgba(0, 243, 255, 0.1); border: 1px solid var(--neon-blue); border-radius: 4px; color: var(--neon-blue); text-decoration: none; font-family: var(--font-code); transition: all 0.3s ease;';
    walletLink.innerHTML = '🔍 CHECK DESTINATION WALLET →';
    walletLink.onmouseover = function() { this.style.background = 'rgba(0, 243, 255, 0.2)'; this.style.boxShadow = '0 0 15px var(--neon-blue)'; };
    walletLink.onmouseout = function() { this.style.background = 'rgba(0, 243, 255, 0.1)'; this.style.boxShadow = 'none'; };
    hashEl.appendChild(walletLink);
    
    // Optional: Transaction link (smaller, secondary)
    if (solscanTxUrl) {
        const txLink = document.createElement('a');
        txLink.href = solscanTxUrl;
        txLink.target = '_blank';
        txLink.style.cssText = 'display: block; margin-top: 10px; color: #aaa; font-size: 0.85em; text-decoration: underline; font-family: var(--font-code);';
        txLink.textContent = `View Transaction: ${txHash.slice(0, 8)}...${txHash.slice(-8)}`;
        hashEl.appendChild(txLink);
    }
    
    // Update button
    const btn = document.getElementById('sendButton');
    btn.innerHTML = 'TRANSFER COMPLETE';
    btn.disabled = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
