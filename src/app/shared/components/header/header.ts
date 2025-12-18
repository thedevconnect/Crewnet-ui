import { Component, ChangeDetectionStrategy, input, output, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule, TooltipModule, MenuModule, SelectModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  user = input.required<UserDetails>();
  onLogout = output<void>();
  onRoleChange = output<string>();

  selectedRole = signal<string>('Admin');
  selectedCity = signal<string>('karnal');
  selectedRoleItem = signal<string>('Ess');

  protected readonly profileMenuItems: MenuItem[] = [];
  protected readonly roleMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initProfileMenu();
    this.initRoleMenu();

    this.selectedRole.set(this.user().role);
    // Set default values
    if (this.cities.length > 0) {
      this.selectedCity.set(this.cities[0]);
    }
    if (this.roleitem.length > 0) {
      this.selectedRoleItem.set(this.roleitem[0]);
    }
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

  protected readonly cities: string[] = [
    'karnal',
    'panipat',
    'rohtak',
    'yamunanagar',
    'ambala',
    'sirsa',
    'faridabad',
    'gurgaon',
  ];
  
  protected readonly roleitem: string[] = [
    'Hr',
    'Ess',
    'Finance',
    'Sales',
    'Engineering',
  ];
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

  onCityChange(city: string): void {
    this.selectedCity.set(city);
    console.log('City changed to:', city);
  }

  onRoleItemChange(roleItem: string): void {
    this.selectedRoleItem.set(roleItem);
    console.log('Role Item changed to:', roleItem);
  }
}
