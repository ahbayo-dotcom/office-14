[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
$OutputEncoding           = [System.Text.Encoding]::UTF8

try {
    $Host.UI.RawUI.WindowTitle = "مزامنة المشروع مع GitHub - Project Sync"
} catch {}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "         PROJECT SYNC | مزامنة المشروع مع GITHUB      " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# 1. سحب التحديثات من GitHub
Write-Host "[1/3] Fetching latest updates from GitHub (Pull)..." -ForegroundColor Yellow
Write-Host "      جاري سحب أي تحديثات جديدة من السحابة..." -ForegroundColor Gray
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Warning: Could not pull updates. Continuing..." -ForegroundColor DarkYellow
}

Write-Host ""
# 2. فحص التعديلات المحلية
Write-Host "[2/3] Checking local changes..." -ForegroundColor Yellow
Write-Host "      جاري فحص الملفات والتعديلات المحلية..." -ForegroundColor Gray
git add .

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host "  [OK] Everything is up to date! (لا توجد تعديلات جديدة)" -ForegroundColor Green
    Write-Host "  Project is fully synchronized with GitHub.           " -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Green
} else {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "      Found local changes. Committing..." -ForegroundColor Yellow
    git commit -m "تحديث تلقائي للمشروع ($now)"
    
    Write-Host ""
    Write-Host "[3/3] Uploading changes to GitHub (Push)..." -ForegroundColor Yellow
    Write-Host "      جاري رفع التعديلات إلى المستودع..." -ForegroundColor Gray
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "======================================================" -ForegroundColor Green
        Write-Host "  [OK] SYNC SUCCESSFUL! | تمت المزامنة والرفع بنجاح!   " -ForegroundColor Green
        Write-Host "  All changes are now live on GitHub.                 " -ForegroundColor Green
        Write-Host "======================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "======================================================" -ForegroundColor Red
        Write-Host "  [X] SYNC FAILED! | فشل رفع التعديلات!               " -ForegroundColor Red
        Write-Host "  Please check your internet connection or login.     " -ForegroundColor Red
        Write-Host "======================================================" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press Enter to close / اضغط Enter للإغلاق..." -ForegroundColor DarkGray
if ([Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
    Read-Host | Out-Null
}
