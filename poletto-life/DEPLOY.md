# دليل نشر الموقع على GitHub Pages 🚀

## الخطوة 1: إنشاء حساب GitHub
1. اذهب إلى https://github.com
2. أنشئ حساب جديد (إذا لم يكن لديك)

## الخطوة 2: إنشاء مستودع جديد
1. اضغط على علامة **+** في الزاوية العلوية اليمنى
2. اختر **New repository**
3. اكتب اسم المستودع: `poletto-life` (أو أي اسم تريده)
4. اختر **Public**
5. اضغط **Create repository**

## الخطوة 3: رفع الملفات
1. اذهب إلى المجلد الذي يحتوي على ملفات الموقع:
   ```
   C:\Users\2025\poletto-life
   ```
2. افتح PowerShell في هذا المجلد
3. اكتب الأوامر التالية:

```powershell
# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "Initial commit - Poletto Life Store"

# ربط المستودع
git remote add origin https://github.com/YOUR_USERNAME/poletto-life.git

# رفع الملفات
git branch -M main
git push -u origin main
```

**ملاحظة:** استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك في GitHub

## الخطوة 4: تفعيل GitHub Pages
1. اذهب إلى إعدادات المستودع (Settings)
2. من القائمة الجانبية اختر **Pages**
3. في قسم **Source** اختر:
   - Branch: `main`
   - Folder: `/ (root)`
4. اضغط **Save**

## الخطوة 5: الانتظار
- بعد دقائق قليلة، سيتم نشر الموقع
- ستحصل على رابط مثل:
  ```
  https://YOUR_USERNAME.github.io/poletto-life/
  ```

---

## 🔧 ربط الدومين الخاص بك (اختياري)

إذا كان لديك دومين (مثل polettolife.com):

1. اذهب إلى إعدادات المستودع → Pages
2. في قسم **Custom domain** اكتب الدومين الخاص بك
3. اضغط **Save**
4. اذهب إلى مزود الدومين وأضف سجل DNS:

```
Type: CNAME
Name: @
Value: YOUR_USERNAME.github.io
```

5. انتظر حتى يظهر علامة ✅ في إعدادات Pages

---

## 📝 ملاحظات مهمة

### تحديث الموقع
كلما أردت تحديث الموقع:
```powershell
git add .
git commit -m "Update: وصف التحديث"
git push
```

### مشاكل شائعة

**الموقع لا يعمل:**
- تأكد من أن الملف الرئيسي اسمه `index.html`
- تأكد من تفعيل GitHub Pages

**الصور لا تظهر:**
- تأكد من أن المسارات صحيحة
- استخدم روابط مطلقة للصور الخارجية

**تسجيل الدخول بالديسكورد لا يعمل:**
- تأكد من إضافة الدومين في Discord Developer Portal
- Redirect URI يجب أن يكون:
  ```
  https://YOUR_USERNAME.github.io/poletto-life/auth-callback.html
  ```

---

## 🎯 الخطوات السريعة

```powershell
# 1. افتح PowerShell وانتقل للمجلد
cd C:\Users\2025\poletto-life

# 2. تهيئة Git
git init
git add .
git commit -m "Poletto Life Store"

# 3. ربط المستودع (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/poletto-life.git

# 4. رفع
git branch -M main
git push -u origin main
```

بعد ذلك، فعّل GitHub Pages من إعدادات المستودع وانتظر دقائق!
