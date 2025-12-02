# Quick start script - Run this to start farming
# This script changes to the correct directory and starts farming

Write-Host "🚀 Starting Solana Airdrop Farming..." -ForegroundColor Green
Write-Host ""

# Change to script directory
$scriptDir = "g:\pumpfun"
if (Test-Path $scriptDir) {
    Set-Location $scriptDir
    Write-Host "✅ Changed to directory: $scriptDir" -ForegroundColor Green
} else {
    Write-Host "❌ Directory not found: $scriptDir" -ForegroundColor Red
    exit 1
}

# Check if farming script exists
if (Test-Path "farm_airdrops.ps1") {
    Write-Host "✅ Found farming script" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting farming script..." -ForegroundColor Cyan
    Write-Host ""
    
    # Run the farming script
    & ".\farm_airdrops.ps1"
} else {
    Write-Host "❌ Farming script not found!" -ForegroundColor Red
    Write-Host "   Expected: $scriptDir\farm_airdrops.ps1" -ForegroundColor Yellow
    exit 1
}

