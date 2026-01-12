import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Menu Data Interfaces
export interface UserInfo {
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
}

export interface MainMenu {
  menuId: string;
  menuName: string;
  icon: string;
  route?: string;
  order: number;
}

export interface SubMenu {
  subMenuId: string;
  menuId: string;
  subMenuName: string;
  icon: string;
  route?: string;
  order: number;
}

export interface Level2Menu {
  level2MenuId: string;
  subMenuId: string;
  level2MenuName: string;
  icon: string;
  route: string;
  order: number;
}

export interface MenuData {
  table: UserInfo[];
  table1: MainMenu[];
  table2: SubMenu[];
  table3: Level2Menu[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Sidebar state management using Signals
  private readonly sidebarState = signal<boolean>(true);

  // Event System using BehaviorSubject
  private readonly eventSubject = new BehaviorSubject<string>('');
  public readonly currentEvent: Observable<string> = this.eventSubject.asObservable();

  // Get sidebar state (readonly)
  getSidebarState() {
    return this.sidebarState.asReadonly();
  }

  // Toggle sidebar
  toggleSidebar(): void {
    this.sidebarState.update((state) => !state);
  }

  // Set sidebar state
  setSidebarState(isOpen: boolean): void {
    this.sidebarState.set(isOpen);
  }

  // Computed value for sidebar width classes
  readonly sidebarWidth = computed(() => {
    return this.sidebarState() ? 'w-64' : 'w-16';
  });

  /**
   * Change Event Method - emits 'NAV_BAR' event
   * Event system के लिए method जो 'NAV_BAR' event emit करता है
   */
  changeEvent(): void {
    this.eventSubject.next('NAV_BAR');
  }

  /**
   * Get Menu By Role - Static menu data based on role
   * Role के according static menu data return करता है
   * @param roleId - Role ID (1: HR Admin, 2: Manager, 3: ESS/User)
   * @returns MenuData object with table, table1, table2, table3
   */
  getMenuByRole(roleId: string): MenuData {
    switch (roleId) {
      case '1': // HR Admin Role
        return {
          table: [
            {
              userId: '1',
              userName: 'HR Admin',
              roleId: '1',
              roleName: 'HR Admin'
            }
          ],
          table1: [
            {
              menuId: 'hr-dashboard',
              menuName: 'Dashboard',
              icon: 'pi-home',
              route: '/hr-admin/dashboard',
              order: 1
            },
            {
              menuId: 'hr-employees',
              menuName: 'Employees',
              icon: 'pi-users',
              order: 2
            },
            {
              menuId: 'hr-attendance',
              menuName: 'Attendance',
              icon: 'pi-calendar-check',
              order: 3
            },
            {
              menuId: 'hr-leaves',
              menuName: 'Leaves',
              icon: 'pi-calendar-times',
              order: 4
            },
            {
              menuId: 'hr-shifts',
              menuName: 'Shifts',
              icon: 'pi-clock',
              route: '/hr-admin/shifts',
              order: 5
            },
            {
              menuId: 'hr-departments',
              menuName: 'Departments',
              icon: 'pi-building',
              route: '/hr-admin/departments',
              order: 6
            },
            {
              menuId: 'hr-reports',
              menuName: 'Reports',
              icon: 'pi-file',
              route: '/hr-admin/reports',
              order: 7
            },
            {
              menuId: 'hr-settings',
              menuName: 'Settings',
              icon: 'pi-cog',
              route: '/hr-admin/settings',
              order: 8
            }
          ],
          table2: [
            {
              subMenuId: 'hr-employee-list',
              menuId: 'hr-employees',
              subMenuName: 'Employee List',
              icon: 'pi-list',
              route: '/hr-admin/HrEmployees',
              order: 1
            },
            {
              subMenuId: 'hr-add-employee',
              menuId: 'hr-employees',
              subMenuName: 'Add Employee',
              icon: 'pi-user-plus',
              route: '/hr-admin/HrEmployees',
              order: 2
            },
            {
              subMenuId: 'hr-daily-attendance',
              menuId: 'hr-attendance',
              subMenuName: 'Daily Attendance',
              icon: 'pi-calendar',
              route: '/hr-admin/attendance',
              order: 1
            },
            {
              subMenuId: 'hr-monthly-attendance',
              menuId: 'hr-attendance',
              subMenuName: 'Monthly Report',
              icon: 'pi-chart-bar',
              route: '/hr-admin/attendance',
              order: 2
            },
            {
              subMenuId: 'hr-leave-requests',
              menuId: 'hr-leaves',
              subMenuName: 'Leave Requests',
              icon: 'pi-inbox',
              route: '/hr-admin/leaves',
              order: 1
            },
            {
              subMenuId: 'hr-leave-balance',
              menuId: 'hr-leaves',
              subMenuName: 'Leave Balance',
              icon: 'pi-chart-pie',
              route: '/hr-admin/leaves',
              order: 2
            }
          ],
          table3: []
        };

      case '2': // Manager Role (can reuse HR Admin menu or customize)
        return this.getMenuByRole('1');

      case '3': // ESS (Employee Self Service) Role
        return {
          table: [
            {
              userId: '3',
              userName: 'Employee',
              roleId: '3',
              roleName: 'ESS'
            }
          ],
          table1: [
            {
              menuId: 'ess-dashboard',
              menuName: 'Dashboard',
              icon: 'pi-th-large',
              route: '/ess/dashboard',
              order: 1
            },
            {
              menuId: 'ess-profile',
              menuName: 'My Profile',
              icon: 'pi-user',
              route: '/ess/profile',
              order: 2
            },
            {
              menuId: 'ess-attendance',
              menuName: 'My Attendance',
              icon: 'pi-calendar',
              order: 3
            },
            {
              menuId: 'ess-leaves',
              menuName: 'Leave Application',
              icon: 'pi-file-excel',
              order: 4
            },
            {
              menuId: 'ess-holidays',
              menuName: 'Holiday List',
              icon: 'pi-sun',
              route: '/ess/holidays',
              order: 5
            }
          ],
          table2: [
            {
              subMenuId: 'ess-view-attendance',
              menuId: 'ess-attendance',
              subMenuName: 'View Attendance',
              icon: 'pi-eye',
              route: '/ess/attendance/view',
              order: 1
            },
            {
              subMenuId: 'ess-regularization',
              menuId: 'ess-attendance',
              subMenuName: 'Regularization',
              icon: 'pi-pencil',
              route: '/ess/attendance/regularization',
              order: 2
            },
            {
              subMenuId: 'ess-apply-leave',
              menuId: 'ess-leaves',
              subMenuName: 'Apply Leave',
              icon: 'pi-plus',
              route: '/ess/leaves/apply',
              order: 1
            },
            {
              subMenuId: 'ess-leave-balance',
              menuId: 'ess-leaves',
              subMenuName: 'Leave Balance',
              icon: 'pi-wallet',
              route: '/ess/leaves/balance',
              order: 2
            },
            {
              subMenuId: 'ess-leave-history',
              menuId: 'ess-leaves',
              subMenuName: 'Leave History',
              icon: 'pi-history',
              route: '/ess/leaves/history',
              order: 3
            }
          ],
          table3: []
        };

      default:
        // Default to ESS role
        return this.getMenuByRole('3');
    }
  }

  /**
   * Set Dynamic Form Parameter
   * Dynamic form parameter set करने के लिए method
   * @param params - JSON string containing form parameters
   */
  Setdynamicformparam(params: string): void {
    try {
      const parsedParams = JSON.parse(params);
      // Store in sessionStorage or service state as needed
      sessionStorage.setItem('dynamicFormParams', params);
      // You can also emit an event if needed
      // this.eventSubject.next('FORM_PARAMS_UPDATED');
    } catch (error) {
      console.error('Error setting dynamic form params:', error);
    }
  }
}

