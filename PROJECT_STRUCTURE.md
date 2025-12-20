# Crewnet Project Structure

## Overview
This document describes the organized structure of the Crewnet HRMS application with clear separation between HR Admin and ESS (Employee Self Service) components.

## Folder Structure

```
src/app/
├── core/                    # Core services, guards, interceptors
├── features/                # Shared features (auth, etc.)
│   └── auth/
│       ├── login/
│       └── register/
├── hr-admin/                # HR Admin Components (HR Role)
│   ├── dashboard/           # HR Dashboard
│   ├── employee/            # Employee Management
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   └── services/
│   ├── attendance/          # Attendance Management
│   ├── leaves/              # Leave Management
│   ├── shifts/              # Shift Management
│   ├── departments/         # Department Management
│   ├── reports/             # Reports
│   ├── settings/            # Settings
│   └── tickets/             # Ticket Management
├── ess-components/          # Employee Self Service Components (ESS Role)
│   ├── dashboard/           # ESS Dashboard
│   └── ess-employee/        # Employee Self-Service Features
└── shared/
    └── design/              # Shared UI Components
        ├── header/          # Header Component
        ├── layout/          # Main Layout Component
        └── sidebar/         # Sidebar Component
```

## Role-Based Access

### HR Admin Role (`hr`)
When HR role is selected in the header dropdown, the following menu items are shown:

- **Dashboard** → `/hr-admin/dashboard`
- **Employees**
  - Employee List → `/hr-admin/employees`
  - Add Employee → `/hr-admin/employees/add`
- **Attendance**
  - Daily Attendance → `/hr-admin/attendance/daily`
  - Monthly Report → `/hr-admin/attendance/monthly`
- **Leaves**
  - Leave Requests → `/hr-admin/leaves/requests`
  - Leave Balance → `/hr-admin/leaves/balance`
- **Shifts** → `/hr-admin/shifts`
- **Departments** → `/hr-admin/departments`
- **Reports** → `/hr-admin/reports`
- **Settings** → `/hr-admin/settings`

### ESS Role (`ess`)
When ESS role is selected in the header dropdown, the following menu items are shown:

- **Dashboard** → `/ess/dashboard`
- **My Profile** → `/ess/profile`
- **My Attendance**
  - View Attendance → `/ess/attendance/view`
  - Regularization → `/ess/attendance/regularization`
- **Leave Application**
  - Apply Leave → `/ess/leaves/apply`
  - Leave Balance → `/ess/leaves/balance`
  - Leave History → `/ess/leaves/history`
- **Holiday List** → `/ess/holidays`

## Implementation Details

### Role-Based Menu System
- Role selection happens in the header component
- Layout component receives role changes via `onRoleChange` event
- Menu items are computed based on `selectedRoleId` signal
- Navigation automatically redirects to appropriate dashboard on role change

### Component Organization
- **HR Admin**: All administrative functions for HR personnel
- **ESS Components**: Self-service features for employees
- **Shared Design**: Reusable UI components (header, sidebar, layout)

### Menu System (Currently Static)
- Menus are defined as static arrays in `layout.ts`
- `hrMenuItems`: Menu for HR role
- `essMenuItems`: Menu for ESS role
- Menu filtering happens via computed property based on `selectedRoleId`

### Future Enhancements
- Make menus dynamic (load from API/backend)
- Add more role types (Finance, Sales, Engineering, etc.)
- Implement role-based route guards
- Add permissions-based feature access

## Navigation Flow

1. User logs in → Redirected to `/hr-admin/dashboard` (default)
2. User selects role from header dropdown
3. Layout updates menu based on selected role
4. Navigation redirects to appropriate dashboard
5. Sidebar shows role-specific menu items

## Routes

All routes are defined in `src/app/app.routes.ts`:

- HR Admin routes: `/hr-admin/*`
- ESS routes: `/ess/*`
- Legacy routes redirect to HR Admin for backward compatibility

## Notes

- Currently, menus are **static** (as requested)
- Role change immediately updates sidebar menu
- Each role has its own dashboard
- Components are organized for easy maintenance and scalability

