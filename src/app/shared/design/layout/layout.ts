import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';

interface UserDetails {
  name: string;
  email: string;
  role: string;
}

interface MenuItem {
  menu: string;
  icon: string;
  route: string;
}

interface RoleOption {
  rolDes: string;
  roleId: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    ConfirmDialogModule,
    Header,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
})
export class Layout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(true);
  protected readonly currentUser = this.authService.getCurrentUser();

  protected readonly userDetails = computed<UserDetails>(() => {
    const user = this.currentUser();
    return user
      ? {
        name: user.name,
        email: user.email || '',
        role: user.role || 'User',
      }
      : {
        name: 'Guest User',
        email: 'guest@oblo.com',
        role: 'Guest',
      };
  });

  protected readonly roleList: RoleOption[] = [
    { rolDes: 'ESS', roleId: 'ess' },
    { rolDes: 'HR Admin', roleId: 'hrAdmin' },
  ];

  protected readonly selectedRoleId = signal<string>('hrAdmin');

  readonly hrMenuItems: MenuItem[] = [
    { menu: 'Dashboard', icon: 'pi-home', route: '/hr-admin/dashboard' },
    { menu: 'Employee Onboarding', icon: 'pi-users', route: '/hr-admin/HrEmployees' },
    { menu: 'Leaves', icon: 'pi-calendar-minus', route: '/hr-admin/leaves' },
    { menu: 'Attendance', icon: 'pi-calendar', route: '/hr-admin/attendance' },
    { menu: 'Shifts', icon: 'pi-clock', route: '/hr-admin/shifts' },
    { menu: 'Departments', icon: 'pi-building', route: '/hr-admin/departments' },
    { menu: 'Reports', icon: 'pi-file', route: '/hr-admin/reports' },
    { menu: 'Settings', icon: 'pi-cog', route: '/hr-admin/settings' },
    { menu: 'Tickets', icon: 'pi-ticket', route: '/hr-admin/tickets' },
    { menu: 'Logout', icon: 'pi-sign-out', route: '/hr-admin/logout' },
  ];

  readonly essMenuItems: MenuItem[] = [
    { menu: 'Dashboard', icon: 'pi-home', route: '/ess/dashboard' },
    { menu: 'Employee Profile Setup', icon: 'pi-user', route: '/ess/emp-profile-setup' },
    { menu: 'Leaves', icon: 'pi-calendar-minus', route: '/ess/leaves' },
    { menu: 'Attendance', icon: 'pi-calendar', route: '/ess/attendance' },
    { menu: 'Employee Calendar', icon: 'pi-calendar-plus', route: '/ess/employee-calendar' },
    { menu: 'Shifts', icon: 'pi-clock', route: '/ess/shifts' },
    { menu: 'Departments', icon: 'pi-building', route: '/ess/departments' },
    { menu: 'Reports', icon: 'pi-file', route: '/ess/reports' },
    { menu: 'Settings', icon: 'pi-cog', route: '/ess/settings' },
    { menu: 'Tickets', icon: 'pi-ticket', route: '/ess/tickets' },
    { menu: 'Holidays', icon: 'pi-calendar-times', route: '/ess/holidays' },
    { menu: 'Logout', icon: 'pi-sign-out', route: '/ess/logout' },
  ];

  protected readonly menuItemsWithSubmenu = computed<MenuItem[]>(() => {
    const roleId = this.selectedRoleId();
    return roleId === 'ess' ? this.essMenuItems : this.hrMenuItems;
  });

  onRoleChange(roleId: string): void {
    this.selectedRoleId.set(roleId);
    const route = roleId === 'ess' ? '/ess/dashboard' : '/hr-admin/dashboard';
    this.router.navigate([route]);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.router.navigate(['/login']);
    //    this.authService.logout();
  }

  getDashboardRoute(): string {
    return this.selectedRoleId() === 'ess' ? '/ess/dashboard' : '/hr-admin/dashboard';
  }
}
