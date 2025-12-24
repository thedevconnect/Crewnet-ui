import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Layout } from './shared/design/layout/layout';
import { HrDashboard } from './hr-admin/dashboard/dashboard';
import { EssDashboard } from './ess-components/dashboard/dashboard';

// HR Admin Components
import { Attendance } from './pages/attendance/attendance';
import { Leaves } from './features/leaves/leaves';
import { HrEmployees } from './hr-admin/employees/hr-employees/hr-employees';

// ESS Components
import { EssEmployee } from './ess-components/ess-employee/ess-employee';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', },
  { path: 'login', component: Login, },
  { path: 'register', component: Register, },
  {
    path: '', component: Layout, canActivate: [authGuard],
    children: [
      // HR Admin Routes
      {
        path: 'hr-admin',
        children: [
          { path: 'dashboard', component: HrDashboard },
          { path: 'HrEmployees', component: HrEmployees },
          { path: 'leaves', component: Leaves },
        ],
      },
      // ESS Routes
      {
        path: 'ess',
        children: [
          { path: 'dashboard', component: EssDashboard },
          { path: 'attendance', component: Attendance },
          { path: 'leaves', component: Leaves },
        ],
      },
      { path: 'dashboard', redirectTo: '/hr-admin/dashboard', pathMatch: 'full', },
      { path: 'HrEmployees', redirectTo: '/hr-admin/HrEmployees', pathMatch: 'full', },
      { path: 'attendance', redirectTo: '/hr-admin/attendance', pathMatch: 'full', },
      { path: 'leaves', redirectTo: '/hr-admin/leaves', pathMatch: 'full', },
    ],
  },
  { path: '**', redirectTo: '/hr-admin/dashboard', },
];
