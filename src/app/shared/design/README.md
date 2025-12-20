# Design Components

This folder contains all design-related UI components for the application layout.

## Structure

```
design/
├── header/          # Header component (top navigation bar)
├── layout/          # Main layout component (sidebar + content wrapper)
└── sidebar/         # Sidebar navigation component
```

## Components

### Header (`header/`)
- **Purpose**: Top navigation bar with dropdowns and user info
- **Features**:
  - Toggle button for sidebar
  - District dropdown
  - Role dropdown
  - User avatar with menu

### Layout (`layout/`)
- **Purpose**: Main application layout wrapper
- **Features**:
  - Sidebar integration
  - Header integration
  - Main content area
  - Footer
  - Route outlet for child components

### Sidebar (`sidebar/`)
- **Purpose**: Left navigation sidebar
- **Features**:
  - Navigation menu items
  - Submenu support
  - Collapse/expand functionality
  - Hover menu for collapsed state

## Usage

All components are standalone and can be imported directly:

```typescript
import { Layout } from './shared/design/layout/layout';
import { Header } from './shared/design/header/header';
import { Sidebar } from './shared/design/sidebar/sidebar';
```

## Future Design Components

When adding new design-related components, place them in this folder for easy organization and accessibility.

