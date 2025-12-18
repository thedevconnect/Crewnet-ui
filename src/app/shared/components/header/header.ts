import { Component, ChangeDetectionStrategy, input, output, OnInit, signal } from '@angular/core';
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
export class Header implements OnInit {
  user = input.required<UserDetails>();
  onLogout = output<void>();
  onRoleChange = output<string>();

  selectedRole = signal<string>('Admin');

  protected readonly profileMenuItems: MenuItem[] = [];
  protected readonly roleMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initProfileMenu();
    this.initRoleMenu();

    this.selectedRole.set(this.user().role);
  }

  private initProfileMenu(): void {
    this.profileMenuItems.push(
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.handleProfile(),
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      }
    );
  }

  private initRoleMenu(): void {
    this.roleMenuItems.push(
      {
        label: 'Admin',
        icon: 'pi pi-briefcase',
        command: () => this.changeRole('Admin'),
      },
      {
        label: 'Manager',
        icon: 'pi pi-users',
        command: () => this.changeRole('Manager'),
      },
      {
        label: 'User',
        icon: 'pi pi-user',
        command: () => this.changeRole('User'),
      }
    );
  }

  logout(): void {
    this.onLogout.emit();
  }

  handleProfile(): void {
    console.log('Navigate to profile');
  }

  changeRole(role: string): void {
    this.selectedRole.set(role);
    this.onRoleChange.emit(role);
    console.log('Role changed to:', role);
  }
}
