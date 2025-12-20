import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Layout } from './shared/design/layout/layout';
import { HrDashboard } from './hr-admin/dashboard/dashboard';
import { EssDashboard } from './ess-components/dashboard/dashboard';

// HR Admin Components
import { EmployeeList } from './hr-admin/employee/pages/employee-list/employee-list';
import { Attendance } from './pages/attendance/attendance';
import { Leaves } from './features/leaves/leaves';
import { Shifts } from './features/shifts/shifts';
import { Departments } from './features/departments/departments';
import { Reports } from './features/reports/reports';
import { Settings } from './features/settings/settings';

// ESS Components
import { EssEmployee } from './ess-components/ess-employee/ess-employee';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      // HR Admin Routes
      {
        path: 'hr-admin',
        children: [
          {
            path: 'dashboard',
            component: HrDashboard,
          },
          {
            path: 'employees',
            component: EmployeeList,
          },
          {
            path: 'attendance',
            component: Attendance,
          },
          {
            path: 'leaves',
            component: Leaves,
          },
          {
            path: 'shifts',
            component: Shifts,
          },
          {
            path: 'departments',
            component: Departments,
          },
          {
            path: 'reports',
            component: Reports,
          },
          {
            path: 'settings',
            component: Settings,
          },
        ],
      },
      // ESS Routes
      {
        path: 'ess',
        children: [
          {
            path: 'dashboard',
            component: EssDashboard,
          },
          {
            path: 'profile',
            component: EssEmployee, // Placeholder - will be replaced with actual ESS profile component
          },
          {
            path: 'attendance',
            children: [
              {
                path: 'view',
                component: EssEmployee, // Placeholder
              },
              {
                path: 'regularization',
                component: EssEmployee, // Placeholder
              },
            ],
          },
          {
            path: 'leaves',
            children: [
              {
                path: 'apply',
                component: EssEmployee, // Placeholder
              },
              {
                path: 'balance',
                component: EssEmployee, // Placeholder
              },
              {
                path: 'history',
                component: EssEmployee, // Placeholder
              },
            ],
          },
          {
            path: 'holidays',
            component: EssEmployee, // Placeholder
          },
        ],
      },
      // Legacy routes - redirect to HR Admin for backward compatibility
      {
        path: 'dashboard',
        redirectTo: '/hr-admin/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'employees',
        redirectTo: '/hr-admin/employees',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/hr-admin/dashboard',
  },
];
