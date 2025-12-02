# Fast farming script - Press Enter to create wallet + airdrop
# SOL stays in generated wallets (you control the keys)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 FAST FARMING MODE" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press ENTER to create wallet + airdrop 5 SOL" -ForegroundColor Yellow
Write-Host "SOL stays in wallet (you have the keys)" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$env:RPC_URL = "https://api.devnet.solana.com"
$env:AIRDROP_AMOUNT = "5.0"
$env:WALLETS_DIR = "farmed_wallets"
$env:LOG_FILE = "farming_log.txt"

$count = 0
$successCount = 0

while ($true) {
    $count++
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "Cycle #$count" -ForegroundColor Yellow
    Write-Host "Press ENTER to start..." -ForegroundColor Gray
    $null = Read-Host
    
    # Run script - instant feedback
    $allOutput = node farm_cycle.js 2>&1
    
    # Find the JSON line (starts with {)
    $jsonLine = $allOutput | Where-Object { $_ -match '^\s*\{' } | Select-Object -First 1
    
    if ($jsonLine) {
        $result = $jsonLine | ConvertFrom-Json
        
        if ($result.success) {
            $successCount++
            Write-Host ""
            Write-Host "✅ SUCCESS!" -ForegroundColor Green
            Write-Host "   Wallet: $($result.wallet)" -ForegroundColor Cyan
            Write-Host "   Balance: $([math]::Round($result.balance, 9)) SOL" -ForegroundColor Green
            Write-Host "   Airdrop TX: $($result.airdropSig)" -ForegroundColor Gray
            Write-Host "   Solscan: https://solscan.io/account/$($result.wallet)?cluster=devnet" -ForegroundColor Blue
        } else {
            Write-Host ""
            Write-Host "❌ FAILED" -ForegroundColor Red
            Write-Host "   Error: $($result.error)" -ForegroundColor Red
            if ($result.wallet) {
                Write-Host "   Wallet: $($result.wallet)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host ""
        Write-Host "❌ ERROR: No JSON output" -ForegroundColor Red
        $allOutput | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    }
    
    Write-Host ""
    Write-Host "Total Success: $successCount/$count" -ForegroundColor Cyan
}

