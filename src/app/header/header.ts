import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { UserService } from '../shared/user-service';

/**
 * Header Component
 * Top navigation bar with sidebar toggle, role dropdown, और user menu
 * Mobile responsive design के साथ
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, SelectModule, AvatarModule, MenuModule, TooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() isSidebarOpen: boolean = true;
  
  // Role dropdown data
  roleList: any[] = [];
  selectedRoleId: any = null;
  currentRole: string = 'Select Role';

  // User menu items for PrimeNG Menu
  userMenuItems: MenuItem[] = [];

  // User data - sessionStorage से load होगा
  userData: any = { empnam: 'User' };

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize user menu items
    this.userMenuItems = [
      { 
        label: 'Profile', 
        icon: 'pi pi-user', 
        command: () => this.router.navigate(['/user-profile']) 
      },
      { separator: true },
      { 
        label: 'Logout', 
        icon: 'pi pi-sign-out', 
        command: () => this.onLogout() 
      }
    ];

    // Load user data from sessionStorage
    try {
      const userInfo = sessionStorage.getItem('CurrentUserInfo');
      if (userInfo) {
        this.userData = JSON.parse(userInfo);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  /**
   * Get Icon - Sidebar toggle button के लिए icon return करता है
   * @returns string - PrimeNG icon class
   */
  getIcon(): string {
    return this.isSidebarOpen ? 'pi pi-angle-double-left' : 'pi pi-angle-double-right';
  }

  /**
   * Get User Name - Current user का name return करता है
   * @returns string - User name या 'User' default
   */
  getUserName(): string {
    return this.userData?.empnam || 'User';
  }

  /**
   * Get User Initial - User name का first character return करता है
   * Avatar में display करने के लिए
   * @returns string - Single uppercase character
   */
  getUserInitial(): string {
    return this.getUserName().charAt(0).toUpperCase();
  }

  /**
   * On Logout - User logout करता है और login page पर navigate करता है
   */
  onLogout(): void {
    this.router.navigate(['/login']);
  }

  /**
   * On Role Dropdown Change - Role change होने पर handle करता है
   * @param event - PrimeNG Select change event
   */
  onRoleDropdownChange(event: any): void {
    // Handle role change logic here
    // You can emit event or update sessionStorage as needed
  }
}
