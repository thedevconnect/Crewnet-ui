import { Component, ChangeDetectionStrategy, signal, inject, computed, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface MenuItemWithSubmenu {
  menu: string;
  icon: string;
  route?: string;
}

interface RoleOption {
  rolDes: string;
  roleId: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    SelectModule,
    Header
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService]
})
export class Layout {
  @ViewChild('userMenu') userMenu: any;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(true);
  protected readonly currentUser = this.authService.getCurrentUser();
  protected readonly notificationsCount = signal<number>(3);

  protected readonly userDetails = computed<UserDetails>(() => {
    const user = this.currentUser();
    if (user) {
      return {
        name: user.name,
        email: user.email || '',
        role: user.role || 'User'
      };
    }
    return {
      name: 'Guest User',
      email: 'guest@oblo.com',
      role: 'Guest'
    };
  });

  protected readonly openSubmenus = signal<Set<string>>(new Set());

  protected readonly roleList: RoleOption[] = [
    { rolDes: 'HR Admin', roleId: 'hrAdmin' },
    { rolDes: 'ESS', roleId: 'ess' },
  ];

  protected readonly selectedRoleId = signal<string>('hrAdmin');

  protected readonly currentRole = computed(() => {
    const role = this.roleList.find(r => r.roleId === this.selectedRoleId());
    return role?.rolDes || '';
  });

  onRoleChange(roleId: string): void {
    this.selectedRoleId.set(roleId);
    if (roleId === 'hrAdmin' || roleId === 'hr') {
      this.router.navigate(['/hr-admin/dashboard']);
    } else if (roleId === 'ess') {
      this.router.navigate(['/ess/dashboard']);
    }
  }

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/profile'])
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  private readonly hrMenuItems: MenuItemWithSubmenu[] = [
    { menu: 'Dashboard', icon: 'pi-home', route: '/hr-admin/dashboard' },
    { menu: 'Employees', icon: 'pi-users', route: '/hr-admin/employees' },
    { menu: 'Attendance', icon: 'pi-calendar', route: '/hr-admin/attendance' },
    { menu: 'Leaves', icon: 'pi-calendar-minus', route: '/hr-admin/leaves' },
  ];

  private readonly essMenuItems: MenuItemWithSubmenu[] = [
    { menu: 'Dashboard', icon: 'pi-home', route: '/ess/dashboard' },
    { menu: 'Attendance', icon: 'pi-calendar', route: '/ess/attendance' },
    { menu: 'Leaves', icon: 'pi-calendar-minus', route: '/ess/leaves' },
  ];

  protected readonly menuItemsWithSubmenu = computed<MenuItemWithSubmenu[]>(() => {
    const roleId = this.selectedRoleId();
    if (roleId === 'hrAdmin' || roleId === 'hr') {
      return this.hrMenuItems;
    } else if (roleId === 'ess') {
      return this.essMenuItems;
    }
    return this.hrMenuItems;
  });

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
    if (!this.sidebarOpen()) {
      this.openSubmenus.set(new Set());
    }
  }


  getUserInitial(): string {
    const name = this.userDetails().name || '';
    return name.charAt(0).toUpperCase();
  }

  getUserName(): string {
    return this.userDetails().name || 'User';
  }


  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    const roleId = this.selectedRoleId();
    if (roleId === 'hrAdmin' || roleId === 'hr') {
      return '/hr-admin/dashboard';
    } else if (roleId === 'ess') {
      return '/ess/dashboard';
    }
    return '/hr-admin/dashboard';
  }
}
