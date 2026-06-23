# سكريبت النشر على GitHub Pages
# شغّل هذا السكريبت في PowerShell بعد إنشاء المستودع على GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Poletto Life - نشر على GitHub Pages   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# السؤال عن اسم المستخدم
$username = Read-Host "ادخل اسم المستخدم الخاص بك في GitHub"

if ([string]::IsNullOrEmpty($username)) {
    Write-Host "خطأ: يجب إدخال اسم المستخدم" -ForegroundColor Red
    exit 1
}

$repoName = "poletto-life"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "جاري التهيئة..." -ForegroundColor Yellow

# الانتقال للمجلد الصحيح
Set-Location "C:\Users\2025\poletto-life"

# تهيئة Git
git init

# إضافة الملفات
git add .

# إنشاء commit
git commit -m "Poletto Life Store - Initial Release"

# ربط المستودع
git remote add origin $repoUrl

# تغيير TBranch إلى main
git branch -M main

# رفع الملفات
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   تم الرفع بنجاح!   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "الآن اذهب إلى GitHub وفعّل GitHub Pages:" -ForegroundColor Yellow
Write-Host "1. افتح: https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host "2. اختر Branch: main" -ForegroundColor Cyan
Write-Host "3. اضغط Save" -ForegroundColor Cyan
Write-Host ""
Write-Host "رابط موقعك سيكون:" -ForegroundColor Yellow
Write-Host "https://$username.github.io/$repoName/" -ForegroundColor Green
Write-Host ""
Write-Host "اضغط أي زر للإغلاق..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
