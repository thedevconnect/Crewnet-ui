import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
  OnInit,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';

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
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    Header,
    Sidebar,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
})
export class Layout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

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
    { rolDes: 'HR Admin', roleId: '1' },
    { rolDes: 'Manager', roleId: '2' },
    { rolDes: 'ESS', roleId: '3' }
  ];

  protected readonly selectedRoleId = signal<string>('1'); // Default to Admin

  ngOnInit(): void {
    // Initialize menu data if not present in sessionStorage
    const savedRoleId = sessionStorage.getItem('selectedRoleId');
    if (savedRoleId) {
      this.selectedRoleId.set(savedRoleId);
    } else {
      // Set default role and load menu data
      sessionStorage.setItem('selectedRoleId', '1');
      const menuData = this.userService.getMenuByRole('1');
      sessionStorage.setItem('CurrentUserMenu', JSON.stringify(menuData.table1));
      sessionStorage.setItem('CurrentUserMenusub', JSON.stringify(menuData.table2));
      sessionStorage.setItem('CurrentUserMenusub_level2', JSON.stringify(menuData.table3));
      if (menuData.table && menuData.table.length > 0) {
        sessionStorage.setItem('CurrentUserInfo', JSON.stringify(menuData.table[0]));
      }
    }

    // Subscribe to UserService events to handle role changes from header
    this.userService.currentEvent.subscribe((event) => {
      if (event === 'NAV_BAR') {
        const roleId = sessionStorage.getItem('selectedRoleId') || '1';
        this.selectedRoleId.set(roleId);
      }
    });
  }

  onRoleChange(roleId: string): void {
    this.selectedRoleId.set(roleId);
    // Role change and navigation are handled by Header component
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    const roleId = this.selectedRoleId();
    switch (roleId) {
      case '1': // HR Admin
        return '/hr-admin/dashboard';
      case '2': // Manager
        return '/hr-admin/dashboard';
      case '3': // ESS
        return '/ess/dashboard';
      default:
        return '/ess/dashboard';
    }
  }
}
