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

interface SubmenuItem {
  activity: string;
  formValue?: string;
  route?: string;
  menu?: string;
  callingPage?: string;
}

interface MenuItemWithSubmenu {
  menu: string;
  icon: string;
  route?: string;
  submenus?: SubmenuItem[];
}

interface DistrictOption {
  drpoption: string;
  drpvalue: string;
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
      email: 'guest@crewnet.com',
      role: 'Guest'
    };
  });

  // Open submenus tracking
  protected readonly openSubmenus = signal<Set<string>>(new Set());
  
  // Hover menu tracking
  protected readonly hoveredMenuSubmenus = signal<SubmenuItem[]>([]);
  protected readonly hoverMenuPosition = signal<{ top: number; left: number } | null>(null);

  // District and Role data for sidebar
  protected readonly distList: DistrictOption[] = [
    { drpoption: 'Abohar', drpvalue: 'abohar' },
    { drpoption: 'Karnal', drpvalue: 'karnal' },
    { drpoption: 'Panipat', drpvalue: 'panipat' },
    { drpoption: 'Rohtak', drpvalue: 'rohtak' },
    { drpoption: 'Yamunanagar', drpvalue: 'yamunanagar' },
    { drpoption: 'Ambala', drpvalue: 'ambala' },
    { drpoption: 'Sirsa', drpvalue: 'sirsa' },
    { drpoption: 'Faridabad', drpvalue: 'faridabad' },
    { drpoption: 'Gurgaon', drpvalue: 'gurgaon' },
  ];

  protected readonly roleList: RoleOption[] = [
    { rolDes: 'Service Engineer', roleId: 'service-engineer' },
    { rolDes: 'HR', roleId: 'hr' },
    { rolDes: 'ESS', roleId: 'ess' },
    { rolDes: 'Finance', roleId: 'finance' },
    { rolDes: 'Sales', roleId: 'sales' },
    { rolDes: 'Engineering', roleId: 'engineering' },
  ];

  protected selectedDistrictValue: string = 'abohar';
  protected selectedRoleId: string = 'service-engineer';
  
  protected readonly selectedDistrict = computed(() => {
    const dist = this.distList.find(d => d.drpvalue === this.selectedDistrictValue);
    return dist?.drpoption || '';
  });

  protected readonly currentRole = computed(() => {
    const role = this.roleList.find(r => r.roleId === this.selectedRoleId);
    return role?.rolDes || '';
  });

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

  // Static menu items with submenus
  protected readonly menuItemsWithSubmenu: MenuItemWithSubmenu[] = [
    {
      menu: 'Ticket',
      icon: 'pi-shield',
      route: '/ticket',
      submenus: [
        { activity: 'Unassigned Requests', formValue: '/ticket/unassigned', menu: 'Ticket' },
        { activity: 'My Tickets', formValue: '/ticket/my-tickets', menu: 'Ticket' },
        { activity: 'All Tickets', formValue: '/ticket/all', menu: 'Ticket' },
      ]
    },
    {
      menu: 'Dashboard',
      icon: 'pi-home',
      route: '/dashboard'
    },
    {
      menu: 'Employees',
      icon: 'pi-users',
      route: '/employees',
      submenus: [
        { activity: 'Employee List', formValue: '/employees', menu: 'Employees' },
        { activity: 'Add Employee', formValue: '/employees/add', menu: 'Employees' },
      ]
    },
    {
      menu: 'Attendance',
      icon: 'pi-calendar',
      route: '/attendance',
      submenus: [
        { activity: 'Daily Attendance', formValue: '/attendance/daily', menu: 'Attendance' },
        { activity: 'Monthly Report', formValue: '/attendance/monthly', menu: 'Attendance' },
      ]
    },
    {
      menu: 'Leaves',
      icon: 'pi-calendar-minus',
      route: '/leaves'
    },
    {
      menu: 'Shifts',
      icon: 'pi-clock',
      route: '/shifts'
    },
    {
      menu: 'Departments',
      icon: 'pi-building',
      route: '/departments'
    },
    {
      menu: 'Reports',
      icon: 'pi-chart-line',
      route: '/reports'
    },
    {
      menu: 'Settings',
      icon: 'pi-cog',
      route: '/settings'
    },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
    // Close all submenus when sidebar closes
    if (!this.sidebarOpen()) {
      this.openSubmenus.set(new Set());
    }
  }

  hasSubmenu(menuName: string): boolean {
    const menu = this.menuItemsWithSubmenu.find(m => m.menu === menuName);
    return !!menu?.submenus && menu.submenus.length > 0;
  }

  getSubmenus(menuName: string): SubmenuItem[] {
    const menu = this.menuItemsWithSubmenu.find(m => m.menu === menuName);
    return menu?.submenus || [];
  }

  isSubmenuOpen(menuName: string): boolean {
    return this.openSubmenus().has(menuName);
  }

  toggleSubmenu(menuName: string, isMainMenu: boolean = false): void {
    const current = new Set(this.openSubmenus());
    if (current.has(menuName)) {
      current.delete(menuName);
    } else {
      current.add(menuName);
    }
    this.openSubmenus.set(current);
  }

  hasSubmenuLevel2(activity: string): boolean {
    return false;
  }

  getSubmenuLevel2(activity: string): SubmenuItem[] {
    return [];
  }

  onHoverMenu(menuName: string, event: MouseEvent): void {
    if (!this.sidebarOpen()) {
      const submenus = this.getSubmenus(menuName);
      this.hoveredMenuSubmenus.set(submenus);
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.hoverMenuPosition.set({
        top: rect.top,
        left: rect.right + 8
      });
    }
  }

  onLeaveMenu(): void {
    setTimeout(() => {
      if (this.hoverMenuPosition() === null) {
        this.clearHover();
      }
    }, 200);
  }

  keepHover(): void {
    // Keep hover menu open
  }

  clearHover(): void {
    this.hoveredMenuSubmenus.set([]);
    this.hoverMenuPosition.set(null);
  }

  changeDistrict(value: string): void {
    this.selectedDistrictValue = value;
    console.log('District changed to:', value);
  }

  onRoleDropdownChange(event: any): void {
    if (event && event.value) {
      this.selectedRoleId = event.value;
      console.log('Role changed to:', event.value);
    }
  }

  getUserInitial(): string {
    const name = this.userDetails().name || '';
    return name.charAt(0).toUpperCase();
  }

  getUserName(): string {
    return this.userDetails().name || 'User';
  }

  action(menu: string, route: string, activity: string, formValue: string): void {
    this.router.navigate([route || formValue]);
  }

  setSubmenuItem(callingPage: string | undefined, formValue: string | undefined): string {
    return formValue || callingPage || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
