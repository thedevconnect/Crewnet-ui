import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-header',
  imports: [ButtonModule, AvatarModule, TooltipModule, MenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  user = input.required<UserDetails>();
  onLogout = output<void>();

  protected userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.handleProfile()
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.handleSettings()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      styleClass: 'text-red-600',
      command: () => this.logout()
    }
  ];

  logout(): void {
    this.onLogout.emit();
  }

  handleProfile(): void {
    // Navigate to profile page
    console.log('Navigate to profile');
  }

  handleSettings(): void {
    // Navigate to settings page
    console.log('Navigate to settings');
  }
}
