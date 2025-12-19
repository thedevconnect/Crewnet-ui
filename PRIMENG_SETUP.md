# PrimeNG Setup Guide for Angular 20

## ✅ Completed Steps

### 1. Removed PrimeNG Packages
- Removed `primeng`, `@primeng/themes`, and `primeicons` from `package.json`
- Removed CSS imports from `angular.json` and `styles.css`

### 2. Cleaned Project
- Deleted `node_modules`
- Deleted `package-lock.json`
- Cleared Angular cache (`.angular` folder)

### 3. Reinstalled Dependencies
- Ran `npm install` to reinstall base dependencies

### 4. Installed PrimeNG v19 (Compatible with Angular 20)
```bash
npm install primeng@^19.0.0 @primeng/themes@^19.0.0 primeicons@latest --legacy-peer-deps
```

**Note:** PrimeNG v20 doesn't exist. PrimeNG jumped from v19 to v21. PrimeNG v19 works with Angular 20 using `--legacy-peer-deps`.

## 📋 Configuration Files

### `src/styles.css`
```css
/* Tailwind CSS v4 - Using PostCSS plugin */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base resets */
* { box-sizing: border-box; }
body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f9fafb;
}

/* PrimeNG Icons - DO NOT use node_modules path */
/* Icons are automatically included via PrimeNG configuration */
```

**Important:** 
- ✅ DO NOT import PrimeNG CSS files (PrimeNG v19+ uses JavaScript-based theming)
- ✅ DO NOT use `node_modules` paths in imports
- ✅ Icons are handled automatically via `providePrimeNG`

### `src/app/app.config.ts`
```typescript
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
// or import Lara from '@primeng/themes/lara';
// or import Material from '@primeng/themes/material';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    providePrimeNG({
      theme: {
        preset: Aura, // Choose your theme: Aura, Lara, or Material
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: false,
        },
      },
    }),
  ],
};
```

### `angular.json`
```json
{
  "styles": [
    "src/styles.css"
  ]
}
```

**Note:** Only include your `styles.css`. PrimeNG styles are injected at runtime.

## 🎯 Standalone Component Imports

### Button Example
```typescript
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule, ButtonModule], // ✅ Correct
  template: `
    <p-button label="Click Me" (onClick)="handleClick()"></p-button>
  `
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

### Card Example
```typescript
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-example',
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card header="Title" subheader="Subtitle">
      <p>Card content goes here</p>
      <ng-template pTemplate="footer">
        <p-button label="Action" icon="pi pi-check"></p-button>
      </ng-template>
    </p-card>
  `
})
export class CardExampleComponent {}
```

### Toast Example (with Service)
```typescript
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-example',
  imports: [CommonModule, ButtonModule, ToastModule],
  providers: [MessageService], // ✅ Required for MessageService
  template: `
    <p-button label="Show Toast" (onClick)="showToast()"></p-button>
    <p-toast></p-toast>
  `
})
export class ToastExampleComponent {
  private messageService = inject(MessageService);

  showToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message sent successfully!'
    });
  }
}
```

### Select Dropdown Example
```typescript
import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-example',
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <p-select 
      [options]="cities" 
      [(ngModel)]="selectedCity"
      placeholder="Select a City"
      [filter]="true">
    </p-select>
  `
})
export class SelectExampleComponent {
  cities: string[] = ['New York', 'London', 'Tokyo'];
  selectedCity: string = '';
}
```

### Table Example
```typescript
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-table-example',
  imports: [CommonModule, TableModule],
  template: `
    <p-table [value]="products">
      <ng-template pTemplate="header">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-product>
        <tr>
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class TableExampleComponent {
  products: Product[] = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ];
}
```

## ❌ Common Mistakes to Avoid

### 1. ❌ Don't Import CSS Files in styles.css
```css
/* ❌ WRONG - Don't do this */
@import "node_modules/primeng/resources/themes/lara-light-blue/theme.css";
@import "node_modules/primeng/resources/primeng.min.css";
@import "node_modules/primeicons/primeicons.css";
```

```css
/* ✅ CORRECT - PrimeNG v19+ uses JavaScript theming */
/* No CSS imports needed - handled by providePrimeNG */
```

### 2. ❌ Don't Use Node Modules Paths in angular.json
```json
/* ❌ WRONG */
"styles": [
  "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
  "node_modules/primeicons/primeicons.css"
]
```

```json
/* ✅ CORRECT */
"styles": [
  "src/styles.css"
]
```

### 3. ❌ Don't Forget to Import Modules in Standalone Components
```typescript
/* ❌ WRONG - Missing imports */
@Component({
  selector: 'app-example',
  template: `<p-button label="Click"></p-button>`
})
```

```typescript
/* ✅ CORRECT - Import required modules */
@Component({
  selector: 'app-example',
  imports: [CommonModule, ButtonModule], // ✅ Required
  template: `<p-button label="Click"></p-button>`
})
```

### 4. ❌ Don't Forget CommonModule for Directives
```typescript
/* ❌ WRONG - *ngIf won't work */
@Component({
  imports: [ButtonModule], // Missing CommonModule
  template: `<p-button *ngIf="show"></p-button>`
})
```

```typescript
/* ✅ CORRECT */
@Component({
  imports: [CommonModule, ButtonModule], // ✅ Include CommonModule
  template: `<p-button *ngIf="show"></p-button>`
})
```

### 5. ❌ Don't Use Old NgModule Imports
```typescript
/* ❌ WRONG - Old NgModule way */
import { PrimeNG } from 'primeng/api';
```

```typescript
/* ✅ CORRECT - Standalone component way */
import { ButtonModule } from 'primeng/button';
```

### 6. ❌ Don't Forget MessageService Provider for Toast
```typescript
/* ❌ WRONG - Toast won't show */
@Component({
  imports: [ToastModule],
  template: `<p-toast></p-toast>`
})
```

```typescript
/* ✅ CORRECT - Add MessageService provider */
@Component({
  imports: [ToastModule],
  providers: [MessageService], // ✅ Required
  template: `<p-toast></p-toast>`
})
```

### 7. ❌ Don't Mix Template and Reactive Forms Without FormsModule
```typescript
/* ❌ WRONG - ngModel won't work */
@Component({
  imports: [SelectModule], // Missing FormsModule
  template: `<p-select [(ngModel)]="value"></p-select>`
})
```

```typescript
/* ✅ CORRECT */
@Component({
  imports: [FormsModule, SelectModule], // ✅ Include FormsModule for ngModel
  template: `<p-select [(ngModel)]="value"></p-select>`
})
```

### 8. ❌ Don't Use Incorrect Import Paths
```typescript
/* ❌ WRONG */
import { Button } from 'primeng/button'; // Missing 'Module'
import { pButton } from 'primeng'; // Wrong path
```

```typescript
/* ✅ CORRECT */
import { ButtonModule } from 'primeng/button'; // ✅ Correct path and name
```

## 📦 Installed Packages

```json
{
  "dependencies": {
    "primeng": "^19.0.0",
    "@primeng/themes": "^19.0.0",
    "primeicons": "^7.0.0"
  }
}
```

## 🔄 Available Themes

- **Aura** (Modern, default): `import Aura from '@primeng/themes/aura';`
- **Lara** (Classic): `import Lara from '@primeng/themes/lara';`
- **Material** (Material Design): `import Material from '@primeng/themes/material';`

## 🚀 Next Steps

1. Choose your theme in `app.config.ts` (Aura, Lara, or Material)
2. Import PrimeNG modules in your standalone components
3. Add `CommonModule` when using Angular directives (*ngIf, *ngFor, etc.)
4. Add `FormsModule` when using `ngModel`
5. Add `MessageService` to providers when using Toast component

## 📚 Resources

- [PrimeNG Documentation](https://primeng.org/)
- [PrimeNG Getting Started](https://primeng.org/getting-started)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)

