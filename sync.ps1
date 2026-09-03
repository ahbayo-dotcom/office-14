[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $Host.UI.RawUI.WindowTitle = "مزامنة المشروع مع GitHub"
} catch {}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "          🚀 أداة المزامنة السريعة مع GitHub           " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# 1. سحب التحديثات من GitHub
Write-Host "[1/3] 📥 جاري سحب آخر التحديثات من GitHub (Pull)..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ تنبيه: تعذر سحب البيانات، قد تكون غير متصل بالإنترنت أو هناك تعارض." -ForegroundColor DarkYellow
}

Write-Host ""
# 2. فحص التعديلات المحلية
Write-Host "[2/3] 🔍 جاري فحص التعديلات المحلية..." -ForegroundColor Yellow
git add .

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✨ لا توجد تعديلات محلية جديدة للرفع." -ForegroundColor Green
    Write-Host "المشروع متزامن ومحدث بالكامل مع GitHub!" -ForegroundColor Green
} else {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "📝 تم العثور على تعديلات جديدة، جاري الحفظ..." -ForegroundColor Yellow
    git commit -m "تحديث تلقائي للمشروع ($now)"
    
    Write-Host ""
    Write-Host "[3/3] 📤 جاري رفع التعديلات إلى GitHub (Push)..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "======================================================" -ForegroundColor Green
        Write-Host "           ✅ تمت المزامنة والرفع بنجاح!               " -ForegroundColor Green
        Write-Host "======================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "======================================================" -ForegroundColor Red
        Write-Host "           ❌ فشل رفع التعديلات إلى GitHub!          " -ForegroundColor Red
        Write-Host "  يرجى التحقق من اتصال الإنترنت أو صلاحيات الحساب.     " -ForegroundColor Red
        Write-Host "======================================================" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "اضغط Enter للإغلاق..." -ForegroundColor Gray
if ([Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
    Read-Host | Out-Null
}
