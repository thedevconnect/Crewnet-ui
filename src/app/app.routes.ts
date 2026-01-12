import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Layout } from './shared/design/layout/layout';

// HR Admin Components
import { HrDashboard } from './hr-admin/dashboard/dashboard';
import { Attendance } from './pages/attendance/attendance';
import { Leaves } from './features/leaves/leaves';
import { HrEmployees } from './hr-admin/employees/hr-employees/hr-employees';

// ESS Components
import { EssDashboard } from './ess-components/dashboard/dashboard';
import { EssEmployee } from './ess-components/ess-employee/ess-employee';
import { Pagenotfound } from './pagenotfound/pagenotfound';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      // HR Admin Routes - Role 1
      {
        path: 'hr-admin',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: HrDashboard },
          { path: 'HrEmployees', component: HrEmployees },
          { path: 'attendance', component: Attendance },
          { path: 'leaves', component: Leaves },
          { path: 'shifts', component: HrDashboard }, // Placeholder - replace with actual component
          { path: 'departments', component: HrDashboard }, // Placeholder - replace with actual component
          { path: 'reports', component: HrDashboard }, // Placeholder - replace with actual component
          { path: 'settings', component: HrDashboard }, // Placeholder - replace with actual component
        ],
      },
      // ESS Routes - Role 3
      {
        path: 'ess',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: EssDashboard },
          { path: 'profile', component: EssEmployee }, // Using EssEmployee as profile placeholder
          { path: 'attendance', component: Attendance },
          { path: 'leaves', component: Leaves },
          { path: 'holidays', component: EssDashboard }, // Placeholder - replace with actual component
        ],
      },
      // Default redirects based on role will be handled in layout component
      { path: 'dashboard', redirectTo: '/hr-admin/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', component: Pagenotfound },

  // { path: '**', redirectTo: '/hr-admin/dashboard' },
];
