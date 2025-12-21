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
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  constructor(private router: Router) {
    effect(() => {
      const parentRoleId = this.selectedRoleId();
      if (parentRoleId) {
        if (parentRoleId === 'hr') {
          this.internalSelectedRoleId = 'hrAdmin';
        } else {
          this.internalSelectedRoleId = parentRoleId;
        }
      }
    });
  }
  @ViewChild('userMenu') userMenu: any;

  user = input.required<UserDetails>();
  onLogout = output<void>();
  onRoleChange = output<string>();

  sidebarOpen = input<boolean>(false);
  selectedRoleId = input<string>('hrAdmin');
  onToggleSidebar = output<void>();



  roleList: RoleOption[] = [
    { rolDes: 'HR Admin', roleId: 'hrAdmin' },
    { rolDes: 'ESS', roleId: 'ess' },
  ];

  internalSelectedRoleId: string = 'hrAdmin';

  filteredRoleList = signal<RoleOption[]>(this.roleList);

  currentRole = computed(() => {
    const roleId = this.internalSelectedRoleId || this.selectedRoleId();
    const role = this.roleList.find((r) => r.roleId === roleId);
    return role?.rolDes || 'HR Admin';
  });

  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initUserMenu();

    const parentRoleId = this.selectedRoleId();
    if (parentRoleId === 'hr') {
      this.internalSelectedRoleId = 'hrAdmin';
    } else {
      this.internalSelectedRoleId = parentRoleId || 'hrAdmin';
    }

    if (!this.internalSelectedRoleId && this.roleList.length > 0) {
      this.internalSelectedRoleId = 'hrAdmin';
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

  onRoleDropdownChange(event: any): void {
    if (event && event.value) {
      this.internalSelectedRoleId = event.value;
      this.onRoleChange.emit(event.value);
    }
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
