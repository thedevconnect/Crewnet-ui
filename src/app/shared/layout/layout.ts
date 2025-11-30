import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly authService = inject(AuthService);

  protected readonly sidebarOpen = signal(true);
  protected readonly currentUser = this.authService.getCurrentUser();

  protected readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Employees', icon: '👥', route: '/employees' },
    { label: 'Attendance', icon: '📅', route: '/attendance' },
    { label: 'Leaves', icon: '🏖️', route: '/leaves' },
    { label: 'Shifts', icon: '🕐', route: '/shifts' },
    { label: 'Departments', icon: '🏢', route: '/departments' },
    { label: 'Reports', icon: '📈', route: '/reports' },
    { label: 'Settings', icon: '⚙️', route: '/settings' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}
