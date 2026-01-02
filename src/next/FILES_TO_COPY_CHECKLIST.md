# OBLO Design - Files to Copy Checklist
## कॉपी करने वाली Files की Complete List

---

## ✅ **Priority 1: Core Layout Components (Must Copy)**

### **AppLayout Component**
- [ ] `src/app/applayout/applayout.ts`
- [ ] `src/app/applayout/applayout.html`
- [ ] `src/app/applayout/applayout.scss`

### **Sidebar Component**
- [ ] `src/app/sidebar/sidebar.ts`
- [ ] `src/app/sidebar/sidebar.html`
- [ ] `src/app/sidebar/sidebar.scss`

### **Header Component**
- [ ] `src/app/header/header.ts`
- [ ] `src/app/header/header.html`
- [ ] `src/app/header/header.scss`

---

## ✅ **Priority 2: Shared Services (Must Copy)**

### **Core Services**
- [ ] `src/app/shared/user-service.ts` - Sidebar state, user management
- [ ] `src/app/shared/config.service.ts` - API configuration
- [ ] `src/app/shared/auth.service.ts` - Authentication
- [ ] `src/app/shared/auth-guard.ts` - Route protection
- [ ] `src/app/shared/file-upload.service.ts` - File handling
- [ ] `src/app/shared/loading.service.ts` - Loading state
- [ ] `src/app/shared/excel.service.ts` - Excel operations
- [ ] `src/app/shared/Validation.ts` - Custom validators

### **Directives**
- [ ] `src/app/shared/directive/only-number.directive.ts`
- [ ] `src/app/shared/directive/only-string.directive.ts`
- [ ] `src/app/shared/directive/number-decimal.directive.ts`
- [ ] `src/app/shared/directive/sortable.directive.ts`
- [ ] `src/app/shared/directive/open-date-picker.directive.ts`
- [ ] `src/app/shared/directive/no-dot.directive.ts`

### **Models & Types**
- [ ] `src/app/shared/object-param.model.ts`
- [ ] `src/app/shared/types.d.ts`
- [ ] `src/app/shared/reportWord.ts` (if needed)

---

## ✅ **Priority 3: Common/Reusable Components (Should Copy)**

### **Table Template**
- [ ] `src/app/table-template/table-template.ts`
- [ ] `src/app/table-template/table-template.html`
- [ ] `src/app/table-template/table-template.scss`

### **Image Upload Dialog**
- [ ] `src/app/common-components/image-upload-dialog/` (entire folder)

### **Page Not Found**
- [ ] `src/app/page-not-found/page-not-found.ts`
- [ ] `src/app/page-not-found/page-not-found.html`
- [ ] `src/app/page-not-found/page-not-found.scss`

---

## ✅ **Priority 4: Configuration Files (Must Copy/Update)**

### **Global Styles**
- [ ] `src/styles.scss` - Copy entire content

### **App Configuration**
- [ ] `src/app/app.config.ts` - Copy and customize
- [ ] `src/app/app.routes.ts` - Copy structure, customize routes

### **Angular Configuration**
- [ ] `angular.json` - Update styles array
- [ ] `package.json` - Update dependencies

### **Config File**
- [ ] `src/assets/config.json` - Create new file with your config

---

## ✅ **Priority 5: Assets (Copy Based on Need)**

### **Logos & Icons**
- [ ] `src/assets/OBLO_mainlogo_0.png` - Replace with your logo
- [ ] `src/assets/oblo_icon_fevicon.png` - Replace with your icon
- [ ] `src/assets/chpl_logo.png` (if needed)
- [ ] `src/assets/logo.png` (if needed)

### **Favicon**
- [ ] `src/favicon.ico` - Replace with your favicon
- [ ] `public/favicon.ico` (if exists)

### **Other Assets**
- [ ] `src/assets/404_not_found.json` (if needed)
- [ ] Other image files as per requirement

---

## ⚠️ **Priority 6: Feature Components (Optional - Customize)**

### **Login Component**
- [ ] `src/app/login/login.ts` - Customize for your auth
- [ ] `src/app/login/login.html` - Customize
- [ ] `src/app/login/login.scss` - Customize

### **Home Component**
- [ ] `src/app/home/home.ts` - Customize
- [ ] `src/app/home/home.html` - Customize
- [ ] `src/app/home/home.scss` - Customize

---

## 📋 **Quick Copy Command Reference**

### **For Windows (PowerShell):**
```powershell
# Create directory structure
New-Item -ItemType Directory -Path "src/app/applayout" -Force
New-Item -ItemType Directory -Path "src/app/sidebar" -Force
New-Item -ItemType Directory -Path "src/app/header" -Force
New-Item -ItemType Directory -Path "src/app/shared/directive" -Force
New-Item -ItemType Directory -Path "src/app/table-template" -Force

# Copy files (adjust source path)
Copy-Item "C:\NIPL\Frontend\oblo\src\app\applayout\*" -Destination "src/app/applayout\" -Recurse
Copy-Item "C:\NIPL\Frontend\oblo\src\app\sidebar\*" -Destination "src/app/sidebar\" -Recurse
Copy-Item "C:\NIPL\Frontend\oblo\src\app\header\*" -Destination "src/app/header\" -Recurse
Copy-Item "C:\NIPL\Frontend\oblo\src\app\shared\*" -Destination "src/app/shared\" -Recurse
Copy-Item "C:\NIPL\Frontend\oblo\src\app\table-template\*" -Destination "src/app/table-template\" -Recurse
```

### **For Linux/Mac:**
```bash
# Create directory structure
mkdir -p src/app/{applayout,sidebar,header,shared/directive,table-template}

# Copy files (adjust source path)
cp -r /path/to/oblo/src/app/applayout/* src/app/applayout/
cp -r /path/to/oblo/src/app/sidebar/* src/app/sidebar/
cp -r /path/to/oblo/src/app/header/* src/app/header/
cp -r /path/to/oblo/src/app/shared/* src/app/shared/
cp -r /path/to/oblo/src/app/table-template/* src/app/table-template/
```

---

## 🔄 **After Copying - Update Required**

### **Import Paths Check:**
After copying, check and update these common import paths:

1. **Relative imports** - Ensure paths are correct for new project structure
2. **Asset paths** - Update image paths if assets folder structure changed
3. **API endpoints** - Update all API calls to use ConfigService
4. **Routes** - Update route paths in app.routes.ts

### **Common Updates Needed:**
- [ ] Update `import` statements with correct relative paths
- [ ] Update `assets/` paths in templates
- [ ] Update API endpoints in services
- [ ] Update route configurations
- [ ] Update logo/image paths
- [ ] Update config.json with your API URLs

---

## 📊 **File Count Summary**

- **Core Components:** ~9 files (3 components × 3 files)
- **Shared Services:** ~14 files
- **Directives:** ~6 files
- **Common Components:** ~7 files
- **Config Files:** ~5 files
- **Total:** ~41+ files

---

## ✅ **Final Checklist After Copying**

- [ ] All files copied successfully
- [ ] No TypeScript compilation errors
- [ ] All imports resolved
- [ ] Styles loading correctly
- [ ] Components rendering properly
- [ ] Services working
- [ ] Routes configured
- [ ] Assets loading
- [ ] No console errors
- [ ] Responsive design working
- [ ] Build successful (`ng build`)

---

**Note:** यह checklist OBLO project से files copy करते समय use करें। हर file copy करने के बाद checkbox check करें।

