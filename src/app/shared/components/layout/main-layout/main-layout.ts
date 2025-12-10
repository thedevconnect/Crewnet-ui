import { Component, ChangeDetectionStrategy, signal, inject, computed, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Sidebar, MenuItem } from '../sidebar/sidebar';
import { Header, UserDetails } from '../header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly sidebarOpen = signal(true);
  protected readonly currentUser = this.authService.getCurrentUser();
  
  protected readonly userDetails = computed<UserDetails>(() => {
    const user = this.currentUser();
    if (user) {
      return {
        name: user.name,
        email: user.email || '',
        role: user.role
      };
    }
    return {
      name: 'Guest User',
      email: 'guest@crewnet.com',
      role: 'Guest'
    };
  });

  protected readonly menuItems: MenuItem[] = [
    { label: 'Home', icon: 'pi-home', route: '/dashboard' },
    { label: 'Profile', icon: 'pi-user', route: '/profile' },
    { label: 'Article', icon: 'pi-file', route: '/articles' },
    { label: 'Users', icon: 'pi-users', route: '/employees' },
    { label: 'comments', icon: 'pi-comments', route: '/comments' },
  ];

  protected readonly teams = [
    { name: 'Heroicons', initial: 'H' },
    { name: 'Tailwind Labs', initial: 'T' },
    { name: 'Workcation', initial: 'W' }
  ];

  ngOnInit(): void {
    // Responsive: collapse sidebar on mobile
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    } else {
      this.sidebarOpen.set(true);
    }
  }

  onToggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  onLogout(): void {
    this.authService.logout();
  }
}

