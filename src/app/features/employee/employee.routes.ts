import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employee-list/employee-list').then(m => m.EmployeeList),
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/employee-add/employee-add').then(m => m.EmployeeAdd),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/employee-edit/employee-edit').then(m => m.EmployeeEdit),
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./pages/employee-view/employee-view').then(m => m.EmployeeView),
  },
];
