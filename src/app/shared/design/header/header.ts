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
  styleUrl: './header.scss',
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



  roleList = signal<RoleOption[]>([]);

  internalSelectedRoleId: string = '';

  filteredRoleList = computed(() => this.roleList());

  currentRole = computed(() => {
    const roleId = this.internalSelectedRoleId || this.selectedRoleId();
    const roles = this.roleList();
    const role = roles.find((r) => r.roleId === roleId);
    return role?.rolDes || (roles.length > 0 ? roles[0].rolDes : 'Select Role');
  });

  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initUserMenu();
    this.loadRoles();

    const parentRoleId = this.selectedRoleId();
    if (parentRoleId) {
      this.internalSelectedRoleId = parentRoleId === 'hr' ? 'hrAdmin' : parentRoleId;
    } else {
      const roles = this.roleList();
      if (roles.length > 0) {
        this.internalSelectedRoleId = roles[0].roleId;
      }
    }
  }

  private loadRoles(): void {
    try {
      const rolesStr = localStorage.getItem('oblo_roles');
      if (rolesStr) {
        const roles = JSON.parse(rolesStr) as any[];
        const mappedRoles = roles.map(role => {
          let roleId = role.roleCode?.toLowerCase().replace('_', '') || role.roleCode || `role_${role.id}`;
          
          // Map role codes to existing format
          if (roleId === 'ess') roleId = 'ess';
          else if (roleId === 'hradmin' || roleId === 'hr_admin') roleId = 'hrAdmin';
          else if (roleId === 'superadmin' || roleId === 'super_admin') roleId = 'superAdmin';
          
          return {
            rolDes: role.roleName || role.description || role.roleCode,
            roleId: roleId,
          };
        });
        
        this.roleList.set(mappedRoles);
        
        // Set default selected role if not set
        if (!this.internalSelectedRoleId && mappedRoles.length > 0) {
          this.internalSelectedRoleId = mappedRoles[0].roleId;
        }
      } else {
        // Fallback to default roles if none found
        const defaultRoles = [
          { rolDes: 'HR Admin', roleId: 'hrAdmin' },
          { rolDes: 'ESS', roleId: 'ess' },
        ];
        this.roleList.set(defaultRoles);
        this.internalSelectedRoleId = 'hrAdmin';
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      // Fallback to default roles
      const defaultRoles = [
        { rolDes: 'HR Admin', roleId: 'hrAdmin' },
        { rolDes: 'ESS', roleId: 'ess' },
      ];
      this.roleList.set(defaultRoles);
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
