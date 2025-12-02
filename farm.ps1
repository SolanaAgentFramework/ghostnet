# Simple farming script
param([double]$TargetAmount = 100.0)

# Load master wallet
$master = Get-Content "wallets\master.json" | ConvertFrom-Json
$masterWallet = $master.publicKey

Write-Host "Master: $masterWallet" -ForegroundColor Cyan
Write-Host "Target: $TargetAmount SOL" -ForegroundColor Cyan
Write-Host ""

$total = 0.0
$cycle = 0

while ($total -lt $TargetAmount) {
    $cycle++
    Write-Host "Cycle #$cycle - Total: $([math]::Round($total, 2)) SOL" -ForegroundColor Yellow
    
    $result = node farm_cycle.js 2>&1 | ConvertFrom-Json
    
    if ($result.success) {
        $total += $result.amount
        Write-Host "SUCCESS! +$($result.amount) SOL" -ForegroundColor Green
    } else {
        Write-Host "FAILED: $($result.error)" -ForegroundColor Red
    }
    
    Write-Host "Press ENTER to continue..." -ForegroundColor Yellow
    $null = Read-Host
}

Write-Host "DONE! Total: $([math]::Round($total, 2)) SOL" -ForegroundColor Green
