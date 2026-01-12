import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  OnInit,
  OnChanges,
  ViewChild,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
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
  selector: 'app-header',
  imports: [CommonModule, FormsModule, AvatarModule, TooltipModule, MenuModule, SelectModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  constructor() {
    effect(() => {
      const parentRoleId = this.selectedRoleId();
      if (parentRoleId) {
        this.internalSelectedRoleId = parentRoleId;
      }
    });
  }
  @ViewChild('userMenu') userMenu: any;

  user = input.required<UserDetails>();
  onLogout = output<void>();
  onRoleChange = output<string>();

  sidebarOpen = input<boolean>(false);
  selectedRoleId = input<string>('1'); // Default to Admin role
  onToggleSidebar = output<void>();

  // Role List with HR Admin, Manager, ESS
  roleList: RoleOption[] = [
    { rolDes: 'HR Admin', roleId: '1' },
    { rolDes: 'Manager', roleId: '2' },
    { rolDes: 'ESS', roleId: '3' },
  ];

  // Location dropdown data (Abohar, etc.)
  locationList: any[] = [
    { label: 'Abohar', value: 'abohar' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Mumbai', value: 'mumbai' }
  ];
  selectedLocation: string = 'abohar';

  internalSelectedRoleId: string = '1'; // Default to Admin

  filteredRoleList = signal<RoleOption[]>(this.roleList);

  currentRole = computed(() => {
    const roleId = this.internalSelectedRoleId || this.selectedRoleId();
    const role = this.roleList.find((r) => r.roleId === roleId);
    return role?.rolDes || 'Admin';
  });

  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initUserMenu();

    // Load role from sessionStorage if available
    const savedRoleId = sessionStorage.getItem('selectedRoleId');
    if (savedRoleId) {
      this.internalSelectedRoleId = savedRoleId;
      // Load menu data for saved role
      this.loadMenuDataForRole(savedRoleId);
    } else {
      // Use parent role or default
      const parentRoleId = this.selectedRoleId();
      this.internalSelectedRoleId = parentRoleId || '1';
      // Save default role to sessionStorage
      sessionStorage.setItem('selectedRoleId', this.internalSelectedRoleId);
      // Load menu data for default role
      this.loadMenuDataForRole(this.internalSelectedRoleId);
    }
  }

  private initUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.handleProfile(),
      },
      {
        label: 'Change Password',
        icon: 'pi pi-key',
        command: () => this.handleProfile(),
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  getIcon(): string {
    return this.sidebarOpen() ? 'pi pi-times' : 'pi pi-bars';
  }

  getUserInitial(): string {
    const name = this.user().name || '';
    return name.charAt(0).toUpperCase();
  }

  getUserName(): string {
    return this.user().name || 'User';
  }

  currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  /**
   * On Role Dropdown Change
   * Role change पर menu data load करता है, sessionStorage में save करता है, और event emit करता है
   */
  onRoleDropdownChange(event: any): void {
    if (event && event.value) {
      const roleId = event.value;
      this.internalSelectedRoleId = roleId;

      // Save role to sessionStorage
      sessionStorage.setItem('selectedRoleId', roleId);

      // Load menu data for selected role
      this.loadMenuDataForRole(roleId);

      // Navigate based on role
      this.navigateByRole(roleId);

      // Emit role change event to parent
      this.onRoleChange.emit(roleId);

      // Trigger UserService event to update sidebar
      this.userService.changeEvent();
    }
  }

  /**
   * Load Menu Data For Role
   * Role के according menu data load करके sessionStorage में save करता है (old format में with icons)
   * @param roleId - Selected role ID
   */
  private loadMenuDataForRole(roleId: string): void {
    const menuData = this.userService.getMenuByRole(roleId);

    // Transform and save main menu (table1) to old format with icon info
    const currentUserMenu = menuData.table1.map((item: any) => ({
      menu: item.menuName,
      menuflag: '1',
      icon: item.icon || 'pi-prime', // Preserve icon info
      menuId: item.menuId, // Preserve menuId for reference
      route: item.route || '', // Preserve route
    }));
    sessionStorage.setItem('CurrentUserMenu', JSON.stringify(currentUserMenu));

    // Transform and save sub menu (table2) to old format with icon info
    const currentUserMenusub = menuData.table2.map((item: any) => ({
      menu: item.menuId,
      activity: item.subMenuName,
      formValue: item.route || '',
      callingPage: item.route ? this.getCallingPageTypeFromRoute(item.route) : '',
      menuflag: '1',
      icon: item.icon || 'pi-circle', // Preserve icon info
      subMenuId: item.subMenuId, // Preserve subMenuId for reference
    }));
    sessionStorage.setItem('CurrentUserMenusub', JSON.stringify(currentUserMenusub));

    // Transform and save level2 menu (table3) to old format with icon info
    const currentUserMenusubLevel2 = menuData.table3.map((item: any) => ({
      menu: item.subMenuId,
      activity: item.level2MenuName,
      formValue: item.route || '',
      callingPage: item.route ? this.getCallingPageTypeFromRoute(item.route) : '',
      menuflag: '1',
      icon: item.icon || 'pi-circle', // Preserve icon info
      level2MenuId: item.level2MenuId, // Preserve level2MenuId for reference
    }));
    sessionStorage.setItem('CurrentUserMenusub_level2', JSON.stringify(currentUserMenusubLevel2));

    // Also save user info
    if (menuData.table && menuData.table.length > 0) {
      sessionStorage.setItem('CurrentUserInfo', JSON.stringify(menuData.table[0]));
    }

    // Trigger NAV_BAR event to reload sidebar
    this.userService.changeEvent();
  }

  /**
   * Get Calling Page Type from Route
   * Route से calling page type determine करता है (M/T/R or route)
   */
  private getCallingPageTypeFromRoute(route: string): string {
    // For routes starting with /hr-admin or /ess, return route as is
    if (route.startsWith('/hr-admin') || route.startsWith('/ess')) {
      return route;
    }
    // For other routes, return as is
    return route;
  }

  /**
   * Navigate By Role
   * Role के according route पर navigate करता है
   * @param roleId - Selected role ID
   */
  private navigateByRole(roleId: string): void {
    let route = '/ess/dashboard'; // Default route (ESS)

    switch (roleId) {
      case '1': // HR Admin
        route = '/hr-admin/dashboard';
        break;
      case '2': // Manager (can use HR Admin routes)
        route = '/hr-admin/dashboard';
        break;
      case '3': // ESS/User
        route = '/ess/dashboard';
        break;
    }

    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  handleProfile(): void {
    this.router.navigate(['/profile']);
  }

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }
}
