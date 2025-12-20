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
  constructor() {
    // Sync internal role with parent's selected role
    effect(() => {
      const parentRoleId = this.selectedRoleId();
      if (parentRoleId) {
        // Map 'hr' to 'hrAdmin' for compatibility
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
  selectedRoleId = input<string>('hr'); // Receive selected role from layout

  // District data
  distList: DistrictOption[] = [
    { drpoption: 'Abohar', drpvalue: 'abohar' },
    { drpoption: 'Karnal', drpvalue: 'karnal' },
    { drpoption: 'Panipat', drpvalue: 'panipat' },
    { drpoption: 'Rohtak', drpvalue: 'rohtak' },
    { drpoption: 'Yamunanagar', drpvalue: 'yamunanagar' },
    { drpoption: 'Ambala', drpvalue: 'ambala' },
    { drpoption: 'Sirsa', drpvalue: 'sirsa' },
    { drpoption: 'Faridabad', drpvalue: 'faridabad' },
    { drpoption: 'Gurgaon', drpvalue: 'gurgaon' },
  ];

  // Role data - Only HR Admin and ESS
  roleList: RoleOption[] = [
    { rolDes: 'HR Admin', roleId: 'hrAdmin' },
    { rolDes: 'ESS', roleId: 'ess' },
  ];

  selectedDistrictValue: string = 'abohar';
  internalSelectedRoleId: string = 'hrAdmin'; // Internal state for dropdown

  filteredDistList = signal<DistrictOption[]>(this.distList);
  filteredRoleList = signal<RoleOption[]>(this.roleList);

  selectedDistrict = computed(() => {
    const dist = this.distList.find((d) => d.drpvalue === this.selectedDistrictValue);
    return dist?.drpoption || '';
  });

  currentRole = computed(() => {
    const roleId = this.internalSelectedRoleId || this.selectedRoleId();
    const role = this.roleList.find((r) => r.roleId === roleId);
    return role?.rolDes || 'HR Admin';
  });

  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initUserMenu();

    // Initialize with value from parent, map 'hr' to 'hrAdmin' for compatibility
    const parentRoleId = this.selectedRoleId();
    if (parentRoleId === 'hr') {
      this.internalSelectedRoleId = 'hrAdmin';
    } else {
      this.internalSelectedRoleId = parentRoleId || 'hrAdmin';
    }

    // Set default values if not already set
    if (!this.selectedDistrictValue && this.distList.length > 0) {
      this.selectedDistrictValue = this.distList[0].drpvalue;
    }
    if (!this.internalSelectedRoleId && this.roleList.length > 0) {
      this.internalSelectedRoleId = 'hrAdmin'; // Default to HR Admin
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

  changeDistrict(value: string): void {
    this.selectedDistrictValue = value;
    console.log('District changed to:', value);
    // Emit event if needed
  }

  onRoleDropdownChange(event: any): void {
    if (event && event.value) {
      this.internalSelectedRoleId = event.value;
      // Emit the roleId to parent (layout)
      this.onRoleChange.emit(event.value);
      console.log('Role changed to:', event.value);
    }
  }

  logout(): void {
    this.onLogout.emit();
  }

  handleProfile(): void {
    console.log('Navigate to profile');
  }
}
