# OBLO Design Copy Prompt
## Use this prompt in your new project to copy OBLO design

---

## 📋 **Complete Prompt for AI Assistant:**

```
Mujhe ek Angular 20 project hai jismein OBLO project ka complete design system implement karna hai. 
Yeh OBLO project ka structure hai jo mujhe chahiye:

**Tech Stack:**
- Angular 20.2.0 (Standalone Components)
- PrimeNG 20.3.0 + PrimeFlex 4.0.0  
- Tailwind CSS 4.1.17
- PrimeNG Aura Theme
- SCSS for styling
- Angular Signals for state management

**Design System:**
- Primary Color: #1976D2 (Blue)
- Sidebar Color: #1976D2
- Hover Color: #3581cc
- Background: #F1F5F9
- Layout: Collapsible sidebar (w-64 open, w-16 closed) + Sticky header

**Components Needed:**

1. **AppLayout Component** - Main container with sidebar, header, router-outlet, footer
2. **Sidebar Component** - Collapsible navigation with multi-level menu, hover menu support
3. **Header Component** - Sticky header with sidebar toggle, user menu, dropdowns
4. **Table Template Component** - Reusable table with pagination, sorting, search

**Services Needed:**
1. UserService - Sidebar state management using Signals
2. ConfigService - API configuration
3. AuthService - Authentication
4. AuthGuard - Route protection
5. FileUploadService - File handling
6. LoadingService - Loading state
7. ExcelService - Excel operations

**Directives Needed:**
- OnlyNumberDirective
- OnlyStringDirective
- NumberDecimalDirective
- SortableDirective
- OpenDatePickerDirective

**Global Styles:**
- Tailwind CSS setup
- Custom button styles (#1976D2)
- Skeleton loader styles
- PrimeNG theme overrides

**Configuration:**
- app.config.ts with PrimeNG Aura theme
- styles.scss with Tailwind and custom styles
- config.json for API URLs

Mujhe yeh sab components, services, directives, aur styling files create karke implement karo.
Sab kuch working state mein hona chahiye with proper imports and dependencies.
```

---

## 🎯 **Detailed Step-by-Step Implementation Prompt:**

```
Mujhe OBLO project ka complete design system implement karna hai. Pehle mere current project structure check karo, 
phir step-by-step implement karo:

**STEP 1: Dependencies Check & Install**
- Current package.json check karo
- Missing dependencies install karo (PrimeNG, Tailwind, PrimeFlex, etc.)

**STEP 2: Global Styles Setup**
- styles.scss mein Tailwind CSS import karo
- Custom styles add karo (button-styling, orange-button, custom-skeleton)
- Font family setup (Roboto)

**STEP 3: App Configuration**
- app.config.ts mein PrimeNG Aura theme setup karo
- Toastr, Animations, HttpClient providers add karo
- ConfigService APP_INITIALIZER setup karo

**STEP 4: Shared Services Create**
- UserService with sidebar state (Signals)
- ConfigService with loadConfig
- AuthService with isLoggedIn
- AuthGuard for route protection
- FileUploadService, LoadingService, ExcelService

**STEP 5: Directives Create**
- OnlyNumberDirective, OnlyStringDirective, NumberDecimalDirective
- SortableDirective, OpenDatePickerDirective

**STEP 6: Core Layout Components**
- Applayout: Sidebar toggle, router-outlet wrapper, footer
- Sidebar: Collapsible (w-64/w-16), multi-level menu, hover support
- Header: Sticky header, toggle button, user menu, dropdowns

**STEP 7: Common Components**
- Table Template: Pagination, sorting, search, custom templates

**STEP 8: Routes Setup**
- app.routes.ts mein layout structure setup karo
- AuthGuard apply karo on protected routes

**STEP 9: Assets & Config**
- assets/config.json create karo
- Logo/images paths setup karo

Har step complete hone ke baar mujhe batana, taki main verify kar sakoon.
```

---

## 🔧 **Component-Specific Prompts:**

### **For Applayout Component:**
```
Mujhe Applayout component chahiye jo OBLO design ke hisaab se ho:
- Sidebar component integrate karo (left side, collapsible)
- Header component integrate karo (sticky, top)
- Main content area with router-outlet (bg: #F1F5F9)
- Footer component (bottom)
- Global Toast and ConfirmDialog components
- Sidebar toggle functionality using UserService signals
- Responsive design (mobile sidebar overlay)
```

### **For Sidebar Component:**
```
Mujhe Sidebar component chahiye:
- Collapsible design (w-64 when open, w-16 when closed)
- Blue color scheme (#1976D2)
- Logo display (full logo when open, icon when closed)
- Multi-level menu navigation
- Hover menu popup when sidebar is collapsed
- Menu items from UserService/API
- Smooth transitions
- Custom scrollbar styling
```

### **For Header Component:**
```
Mujhe Header component chahiye:
- Sticky position (top, z-40)
- Sidebar toggle button (hamburger/close icon)
- District dropdown (left side)
- Role dropdown (left side)
- User avatar with menu (right side)
- User name display
- Responsive design (mobile/desktop)
- White background with shadow
```

### **For Table Template:**
```
Mujhe reusable Table Template component chahiye:
- PrimeNG Table based
- Pagination with page size options
- Column sorting (asc/desc)
- Global search functionality
- Custom template slots (actions, custom cells)
- Skeleton loading state
- Responsive design
- Export functionality support
```

---

## 📝 **Quick Copy Commands Prompt:**

```
OBLO project se yeh files copy karke mujhe naye project mein setup karo:

**Files to Copy:**
1. src/app/applayout/ (all files)
2. src/app/sidebar/ (all files)  
3. src/app/header/ (all files)
4. src/app/shared/ (all services and directives)
5. src/app/table-template/ (all files)
6. src/styles.scss (global styles)
7. src/app/app.config.ts (app configuration)
8. src/assets/config.json (configuration file)

Copy karne ke baar:
- Import paths check karo aur fix karo
- Dependencies verify karo
- Build errors check karo
- Components test karo
```

---

## 🎨 **Styling-Specific Prompt:**

```
OBLO project ke design system ke hisaab se styling setup karo:

**Colors:**
- Primary: #1976D2
- Hover: #3581cc
- Background: #F1F5F9
- White: #FFFFFF

**Typography:**
- Font: Roboto (primary), Arial (fallback)

**Layout:**
- Sidebar: 256px (open), 64px (closed)
- Header: 64px height, sticky
- Content: #F1F5F9 background

**Components:**
- Button: #1976D2 background, white text, 11px font
- Cards: White background, rounded, shadow
- Inputs: Border styling, rounded corners
- Tables: Striped rows, hover effects

**Responsive:**
- Mobile: Sidebar overlay, full-width content
- Desktop: Side-by-side layout

Tailwind utility classes use karo, SCSS for component-specific styles.
```

---

## ⚡ **One-Liner Quick Prompt:**

```
Mujhe OBLO project ka complete design system implement karo: Applayout (sidebar + header), UserService (signals), ConfigService, AuthGuard, Table Template component, Tailwind CSS styling (#1976D2 primary color), PrimeNG Aura theme, aur saare shared services/directives. Sab kuch working state mein hona chahiye.
```

---

## 🔄 **For Updates/Modifications:**

```
OBLO design mein yeh changes chahiye:
1. [Your change 1]
2. [Your change 2]
3. [Your change 3]

Pehle current implementation check karo, phir changes apply karo.
```

---

**Note:** Aap in prompts ko directly AI assistant ko de sakte hain apne naye project mein, aur wo step-by-step sab kuch implement kar dega.

