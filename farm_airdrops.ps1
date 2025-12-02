param([double]$TargetAmount = 100.0)

$master = Get-Content "wallets\master.json" | ConvertFrom-Json
$MasterWallet = $master.publicKey

Write-Host "Master: $MasterWallet" -ForegroundColor Cyan
Write-Host "Target: $TargetAmount SOL" -ForegroundColor Cyan
Write-Host ""

$env:RPC_URL = "https://api.devnet.solana.com"
$env:MASTER_WALLET = $MasterWallet
$env:AIRDROP_AMOUNT = "5.0"
$env:GAS_RESERVE = "0.01"
$env:WALLETS_DIR = "farmed_wallets"
$env:LOG_FILE = "farming_log.txt"

$total = 0.0
$cycle = 0

while ($total -lt $TargetAmount) {
    $cycle++
    Write-Host "Cycle #$cycle - Total: $([math]::Round($total, 2)) SOL" -ForegroundColor Yellow
    
    # Run script - logs go to console, JSON is captured from stdout
    $allOutput = node farm_cycle.js 2>&1
    # Find the JSON line (starts with {)
    $jsonLine = $allOutput | Where-Object { $_ -match '^\s*\{' } | Select-Object -First 1
    if ($jsonLine) {
        $result = $jsonLine | ConvertFrom-Json
    } else {
        Write-Host "ERROR: No JSON output found in:" -ForegroundColor Red
        $allOutput | ForEach-Object { Write-Host $_ }
        $result = @{ success = $false; amount = 0 }
    }
    
    if ($result.success) {
        $total += $result.amount
        Write-Host "SUCCESS! +$($result.amount) SOL" -ForegroundColor Green
    } else {
        Write-Host "FAILED" -ForegroundColor Red
    }
    
    Write-Host "Press ENTER..." -ForegroundColor Yellow
    $null = Read-Host
}

Write-Host "DONE! Total: $([math]::Round($total, 2)) SOL" -ForegroundColor Green
