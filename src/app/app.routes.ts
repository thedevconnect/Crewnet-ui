import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
        import('./shared/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'employees',
        loadComponent: () =>
            import('./features/employees/employees').then((m) => m.Employees),
      },
      {
        path: 'attendance',
        loadComponent: () =>
            import('./features/attendance/attendance').then(
              (m) => m.Attendance
            ),
      },
      {
        path: 'leaves',
        loadComponent: () =>
            import('./features/leaves/leaves').then((m) => m.Leaves),
      },
      {
        path: 'shifts',
        loadComponent: () =>
            import('./features/shifts/shifts').then((m) => m.Shifts),
      },
      {
        path: 'departments',
        loadComponent: () =>
            import('./features/departments/departments').then(
              (m) => m.Departments
            ),
      },
      {
        path: 'reports',
        loadComponent: () =>
            import('./features/reports/reports').then((m) => m.Reports),
      },
      {
        path: 'settings',
        loadComponent: () =>
            import('./features/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
