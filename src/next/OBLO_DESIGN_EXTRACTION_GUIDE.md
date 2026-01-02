# OBLO Project Design Extraction Guide
## दूसरे प्रोजेक्ट में OBLO Design इस्तेमाल करने के लिए Steps

---

## 📋 **Project Overview (प्रोजेक्ट अवलोकन)**

OBLO एक Angular 20+ based Enterprise Application है जिसमें निम्नलिखित tech stack use होता है:

### **Tech Stack:**
- **Framework:** Angular 20.2.0 (Standalone Components)
- **UI Library:** PrimeNG 20.3.0 + PrimeFlex 4.0.0
- **Styling:** Tailwind CSS 4.1.17 + SCSS
- **Theme:** PrimeNG Aura Theme + Material Theme
- **State Management:** Angular Signals
- **Icons:** PrimeIcons
- **Charts:** Chart.js + ng2-charts
- **File Handling:** ExcelJS, jsPDF, docx, file-saver
- **Other:** SweetAlert2, ngx-toastr, Leaflet (Maps)

---

## 🎨 **Design System Structure (डिजाइन सिस्टम संरचना)**

### **1. Color Palette (रंग पैलेट)**
```scss
Primary Blue: #1976D2
Sidebar Blue: #1976D2
Hover Blue: #3581cc
Background: #F1F5F9
White: #FFFFFF
Gray Shades: #d1d5db, #e5e7eb, #f3f4f6
```

### **2. Typography (टाइपोग्राफी)**
- **Font Family:** Roboto (primary), Arial (fallback)
- **Font Sizes:** Tailwind utility classes use किए जाते हैं

### **3. Layout Structure (लेआउट संरचना)**
```
┌─────────────────────────────────────┐
│           Header (Sticky)           │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │      Main Content Area       │
│ bar  │      (bg-[#F1F5F9])          │
│      │                              │
│      │                              │
├──────┴──────────────────────────────┤
│           Footer                    │
└─────────────────────────────────────┘
```

---

## 📁 **Step-by-Step Extraction Process (चरण-दर-चरण निष्कर्षण प्रक्रिया)**

### **STEP 1: Project Setup & Dependencies (प्रोजेक्ट सेटअप)**

#### **1.1 Angular Project बनाएं:**
```bash
ng new your-project-name --routing --style=scss --standalone
cd your-project-name
```

#### **1.2 Required Packages Install करें:**
```bash
npm install @angular/core@^20.2.0 @angular/common@^20.2.0 @angular/router@^20.2.0
npm install @angular/forms@^20.2.0 @angular/platform-browser@^20.2.0
npm install @angular/material@^20.2.4 @angular/animations@^20.2.4
npm install primeng@^20.3.0 primeflex@^4.0.0 primeicons@^7.0.0
npm install @primeng/themes@^20.1.1 @primeuix/themes@^1.2.3
npm install tailwindcss@^4.1.17 @tailwindcss/postcss@^4.1.13
npm install postcss@^8.5.6 autoprefixer@^10.4.22
npm install chart.js@^4.5.1 ng2-charts@^8.0.0
npm install sweetalert2@^11.26.3 ngx-toastr@^19.1.0
npm install exceljs@^4.4.0 jspdf@^3.0.3 jspdf-autotable@^5.0.2
npm install docx@^9.5.1 file-saver@^2.0.5
npm install moment@^2.30.1
npm install leaflet@^1.9.4 @types/leaflet@^1.9.21
```

#### **1.3 Tailwind CSS Setup:**
```bash
# tailwind.config.js create करें (अगर नहीं है)
npx tailwindcss init
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

### **STEP 2: Global Styles Setup (ग्लोबल स्टाइल सेटअप)**

#### **2.1 `src/styles.scss` file में ये styles add करें:**

```scss
@use "tailwindcss";

.arial {
    font-family: Arial, Helvetica, sans-serif;
}

body {
    font-family: "Roboto", sans-serif;
}

.custom-skeleton {
    background-color: #e2e8f0 !important;
}

.button-styling {
    background-color: #1976D2;
    cursor: pointer;
}

.orange-button {
    background-color: #1976D2 !important;
    color: #ffffff !important;
    font-size: 11px !important;
    .pi {
        font-size: 11px !important;
    }
}
```

#### **2.2 `angular.json` में styles configure करें:**
```json
"styles": [
  "src/styles.scss"
]
```

---

### **STEP 3: App Configuration (ऐप कॉन्फिगरेशन)**

#### **3.1 `src/app/app.config.ts` file create/update करें:**

```typescript
import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
    }),
  ]
};
```

---

### **STEP 4: Core Layout Components (कोर लेआउट कंपोनेंट्स)**

#### **4.1 Applayout Component Copy करें:**

**Files to Copy:**
- `src/app/applayout/applayout.ts`
- `src/app/applayout/applayout.html`
- `src/app/applayout/applayout.scss`

**Key Features:**
- Sidebar toggle functionality
- Header integration
- Main content area with router-outlet
- Footer component
- Global toast & confirm dialog

#### **4.2 Sidebar Component Copy करें:**

**Files to Copy:**
- `src/app/sidebar/sidebar.ts`
- `src/app/sidebar/sidebar.html`
- `src/app/sidebar/sidebar.scss`

**Key Features:**
- Collapsible sidebar (w-64 when open, w-16 when closed)
- Multi-level menu navigation
- Hover menu for collapsed state
- Blue color scheme (#1976D2)
- Logo display (full/icon based on state)

#### **4.3 Header Component Copy करें:**

**Files to Copy:**
- `src/app/header/header.ts`
- `src/app/header/header.html`
- `src/app/header/header.scss`

**Key Features:**
- Sticky header (z-40)
- Sidebar toggle button
- District & Role dropdowns
- User avatar with menu
- Responsive design (mobile/desktop)

---

### **STEP 5: Shared Services & Utilities (शेयर्ड सर्विसेज)**

#### **5.1 Shared Services Copy करें:**

**Essential Services:**
1. **UserService** (`src/app/shared/user-service.ts`)
   - Sidebar state management (Signals)
   - User data management
   - Event handling

2. **ConfigService** (`src/app/shared/config.service.ts`)
   - API URL configuration
   - Config file loading

3. **AuthService** (`src/app/shared/auth.service.ts`)
   - Authentication state
   - Token management

4. **AuthGuard** (`src/app/shared/auth-guard.ts`)
   - Route protection

5. **FileUploadService** (`src/app/shared/file-upload.service.ts`)
   - File upload utilities
   - Image path normalization

6. **LoadingService** (`src/app/shared/loading.service.ts`)
   - Global loading state

7. **ExcelService** (`src/app/shared/excel.service.ts`)
   - Excel export/import functionality

#### **5.2 Shared Directives Copy करें:**

**Directories:**
- `src/app/shared/directive/`
  - `only-number.directive.ts`
  - `only-string.directive.ts`
  - `number-decimal.directive.ts`
  - `sortable.directive.ts`
  - `open-date-picker.directive.ts`

---

### **STEP 6: Common Components (कॉमन कंपोनेंट्स)**

#### **6.1 Table Template Component:**

**Files to Copy:**
- `src/app/table-template/table-template.ts`
- `src/app/table-template/table-template.html`
- `src/app/table-template/table-template.scss`

**Features:**
- Pagination
- Sorting
- Search
- Custom templates support
- Skeleton loading
- Responsive design

#### **6.2 Image Upload Dialog:**

**Files to Copy:**
- `src/app/common-components/image-upload-dialog/`

---

### **STEP 7: Assets & Configuration (एसेट्स और कॉन्फिगरेशन)**

#### **7.1 Assets Copy करें:**

**Required Assets:**
- Logo files (OBLO_mainlogo_0.png, oblo_icon_fevicon.png)
- Favicon
- Any other images/icons

**Directory:** `src/assets/`

#### **7.2 Config File Create करें:**

**File:** `src/assets/config.json`
```json
{
  "apiUrl": "your-api-url",
  "baseUrl": "your-base-url",
  "elockerUrl": "your-elocker-url",
  "appTitle": "Your App Title"
}
```

---

### **STEP 8: Routing Setup (रूटिंग सेटअप)**

#### **8.1 Routes Configure करें:**

**File:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Applayout } from './applayout/applayout';
import { PageNotFound } from './page-not-found/page-not-found';
import { authGuard } from './shared/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Applayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      // Add your routes here
    ]
  },
  { path: '**', component: PageNotFound }
];
```

---

### **STEP 9: Styling Patterns (स्टाइलिंग पैटर्न्स)**

#### **9.1 Component Structure Pattern:**

```typescript
// Component Structure
@Component({
  selector: 'app-component-name',
  imports: [
    CommonModule,
    // PrimeNG modules
    // Other dependencies
  ],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss'
})
```

#### **9.2 SCSS File Pattern:**

```scss
// Component-specific styles
:host {
  // Host styles
}

// PrimeNG overrides
::ng-deep .p-component-class {
  // Custom styles
}

// Responsive styles
@media (max-width: 768px) {
  // Mobile styles
}
```

#### **9.3 HTML Template Pattern:**

```html
<!-- Use Tailwind utility classes -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <!-- Content -->
</div>

<!-- PrimeNG components -->
<p-button label="Save" icon="pi pi-check" styleClass="button-styling"></p-button>
```

---

### **STEP 10: Key Design Patterns (मुख्य डिजाइन पैटर्न्स)**

#### **10.1 Card Layout Pattern:**

```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-xl font-semibold mb-4">Card Title</h2>
  <div class="content">
    <!-- Content -->
  </div>
</div>
```

#### **10.2 Form Layout Pattern:**

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="form-group">
    <label class="block text-sm font-medium mb-2">Label</label>
    <p-inputText [(ngModel)]="value" class="w-full"></p-inputText>
  </div>
</div>
```

#### **10.3 Button Pattern:**

```html
<p-button 
  label="Action" 
  icon="pi pi-check" 
  [style]="{ 'background-color': '#1976D2', color: '#ffffff' }"
  (onClick)="handleAction()">
</p-button>
```

#### **10.4 Table Pattern:**

```html
<app-table-template
  [data]="tableData"
  [columns]="columns"
  [isLoading]="isLoading"
  [totalCount]="totalCount"
  (pageChange)="onPageChange($event)"
  (sortChange)="onSortChange($event)">
</app-table-template>
```

---

## 📦 **File Structure to Copy (कॉपी करने वाली फ़ाइल संरचना)**

### **Complete Directory Structure:**

```
src/app/
├── applayout/          ✅ Copy (Core Layout)
├── sidebar/            ✅ Copy (Navigation)
├── header/             ✅ Copy (Top Bar)
├── shared/             ✅ Copy (Services & Utilities)
│   ├── directive/      ✅ Copy (Custom Directives)
│   ├── *.service.ts    ✅ Copy (All Services)
│   └── auth-guard.ts   ✅ Copy
├── table-template/     ✅ Copy (Reusable Table)
├── common-components/  ✅ Copy (Shared Components)
├── page-not-found/     ✅ Copy (Error Page)
└── login/              ⚠️ Customize (Your Auth)

src/assets/
├── config.json         ✅ Create (Configuration)
├── *.png               ✅ Copy (Images/Logos)
└── favicon.ico         ✅ Copy

src/styles.scss         ✅ Copy (Global Styles)

angular.json            ⚠️ Update (Styles config)
package.json            ⚠️ Update (Dependencies)
```

---

## 🚀 **Implementation Checklist (इम्प्लीमेंटेशन चेकलिस्ट)**

### **Phase 1: Setup (सेटअप)**
- [ ] Angular project create करें
- [ ] All dependencies install करें
- [ ] Tailwind CSS configure करें
- [ ] Global styles setup करें
- [ ] App config setup करें

### **Phase 2: Core Components (कोर कंपोनेंट्स)**
- [ ] Applayout component copy करें
- [ ] Sidebar component copy करें
- [ ] Header component copy करें
- [ ] Components integrate करें

### **Phase 3: Services & Utilities (सर्विसेज)**
- [ ] Shared services copy करें
- [ ] Directives copy करें
- [ ] Services configure करें

### **Phase 4: Common Components (कॉमन कंपोनेंट्स)**
- [ ] Table template copy करें
- [ ] Other common components copy करें

### **Phase 5: Configuration (कॉन्फिगरेशन)**
- [ ] Routes setup करें
- [ ] Config file create करें
- [ ] Assets copy करें

### **Phase 6: Testing (टेस्टिंग)**
- [ ] Layout test करें
- [ ] Navigation test करें
- [ ] Responsive design test करें
- [ ] Components test करें

---

## ⚠️ **Important Notes (महत्वपूर्ण नोट्स)**

1. **API Integration:** आपको अपने API endpoints update करने होंगे
2. **Authentication:** Login/Auth logic अपने अनुसार customize करें
3. **Menu Structure:** Menu data structure अपने backend के अनुसार adjust करें
4. **Theme Customization:** Colors और styling अपनी brand के अनुसार change कर सकते हैं
5. **Dependencies:** सभी package versions check करें और update करें यदि आवश्यक हो

---

## 🎯 **Quick Start Commands (त्वरित प्रारंभ कमांड)**

```bash
# 1. Project setup
ng new my-project --routing --style=scss --standalone
cd my-project

# 2. Install dependencies
npm install [all packages from STEP 1.2]

# 3. Copy files
# (Manually copy files as per STEP 4-7)

# 4. Build & Run
ng serve
```

---

## 📚 **Additional Resources (अतिरिक्त संसाधन)**

- **PrimeNG Documentation:** https://primeng.org/
- **Tailwind CSS Documentation:** https://tailwindcss.com/
- **Angular Documentation:** https://angular.io/docs

---

## 💡 **Tips (टिप्स)**

1. **Incremental Approach:** एक समय में एक component copy करें और test करें
2. **Version Compatibility:** Angular 20+ ensure करें
3. **Type Safety:** TypeScript types properly define करें
4. **Code Cleanup:** Unused code remove करें
5. **Customization:** Design को अपनी requirements के अनुसार modify करें

---

**Note:** यह guide OBLO project के design structure को extract करने के लिए है। आप अपनी specific requirements के अनुसार customize कर सकते हैं।

**Good Luck! 🎉**

