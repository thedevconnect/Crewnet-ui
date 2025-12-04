import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Layout } from './shared/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Attendance } from './features/attendance/attendance';
import { Leaves } from './features/leaves/leaves';
import { Shifts } from './features/shifts/shifts';
import { Departments } from './features/departments/departments';
import { Reports } from './features/reports/reports';
import { Settings } from './features/settings/settings'; 

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
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'employees',
        component: Employees,
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
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
