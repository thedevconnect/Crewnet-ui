import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { Header } from '../components/header/header';

interface NavMenuItem {
  label: string;
  icon: string;
  route: string;
}

interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, AvatarModule, MenuModule, TooltipModule, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
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
  protected readonly currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  protected readonly menuItems: NavMenuItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'Employees', icon: 'pi-users', route: '/employees' },
    { label: 'Attendance', icon: 'pi-calendar', route: '/attendance' },
    { label: 'Leaves', icon: 'pi-calendar-minus', route: '/leaves' },
    { label: 'Shifts', icon: 'pi-clock', route: '/shifts' },
    { label: 'Departments', icon: 'pi-building', route: '/departments' },
    { label: 'Reports', icon: 'pi-chart-line', route: '/reports' },
    { label: 'Settings', icon: 'pi-cog', route: '/settings' },
  ];

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/profile'])
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.router.navigate(['/settings'])
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

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}
