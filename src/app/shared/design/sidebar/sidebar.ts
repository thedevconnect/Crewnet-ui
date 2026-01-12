import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ChangeDetectorRef,
  input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user-service';
import { SkeletonModule } from 'primeng/skeleton';

// Menu item interfaces for old structure
interface MenuItem {
  menu: string;
  menuflag?: string;
  icon?: string;
  menuId?: string;
  route?: string;
}

interface SubMenuItem {
  menu: string;
  activity: string;
  formValue?: string;
  callingPage?: string;
  menuflag?: string;
  icon?: string;
  subMenuId?: string;
  route?: string;
}

interface Level2MenuItem {
  menu: string;
  activity: string;
  formValue?: string;
  callingPage?: string;
  menuflag?: string;
  icon?: string;
  level2MenuId?: string;
}

/**
 * Sidebar Component - Old Structure
 * Role-based sidebar with hierarchical menu structure matching old format
 */
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SkeletonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  // Sidebar state - accepts input from parent
  sidebarOpen = input<boolean>(true);

  // Output event for sidebar toggle
  @Output() toggleSidebar = new EventEmitter<void>();

  // Menu data arrays - sessionStorage से load होगा (old structure)
  currentusermenu: MenuItem[] = [];
  currenusermenusub: SubMenuItem[] = [];
  CurrentUserMenusub_level2: Level2MenuItem[] = [];

  // Submenu state management
  private submenus = signal<{ [key: string]: boolean }>({});

  // Loading state
  isLoading = signal<boolean>(false);

  // Hover menu state (for collapsed sidebar)
  hoveredMenuSubmenus: SubMenuItem[] = [];
  hoverMenuPosition: { top: number; left: number } | null = null;
  hoveredOverPopup = false;

  ngOnInit(): void {
    // Load initial menu data
    this.loadMenuData();

    // Subscribe to UserService events - NAV_BAR event पर menu reload होगा
    this.userService.currentEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: string | any) => {
        // Handle both string events and object events for compatibility
        if (event === 'NAV_BAR' || (typeof event === 'object' && event && event.eventName === 'NAV_BAR')) {
          this.loadMenuData();
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load Menu Data from sessionStorage
   * sessionStorage से menu data load करता है और old format में transform करता है
   */
  loadMenuData(): void {
    try {
      this.isLoading.set(true);

      // Load main menu (table1) - check if already in old format or needs transformation
      const currentUserMenu = sessionStorage.getItem('CurrentUserMenu');
      if (currentUserMenu) {
        const menuData = JSON.parse(currentUserMenu);
        if (Array.isArray(menuData)) {
          // Check if already in old format (has 'menu' property) or needs transformation
          if (menuData.length > 0 && menuData[0].menuName) {
            // New format - transform to old format with icon
            this.currentusermenu = menuData.map((item: any) => ({
              menu: item.menuName,
              menuflag: '1',
              icon: item.icon || 'pi-prime',
              menuId: item.menuId,
              route: item.route || '',
            }));
          } else {
            // Already in old format (with or without icon)
            this.currentusermenu = menuData.map((item: any) => ({
              ...item,
              icon: item.icon || 'pi-prime', // Ensure icon is present
            }));
          }
        } else {
          this.currentusermenu = [];
        }
      }

      // Load sub menu (table2) - check if already in old format or needs transformation
      const currentUserMenusub = sessionStorage.getItem('CurrentUserMenusub');
      if (currentUserMenusub) {
        const subMenuData = JSON.parse(currentUserMenusub);
        if (Array.isArray(subMenuData)) {
          // Check if already in old format (has 'activity' property) or needs transformation
          if (subMenuData.length > 0 && subMenuData[0].subMenuName) {
            // New format - transform to old format with icon
            this.currenusermenusub = subMenuData.map((item: any) => ({
              menu: item.menuId,
              activity: item.subMenuName,
              formValue: item.route || '',
              callingPage: item.route || '',
              menuflag: '1',
              icon: item.icon || 'pi-circle',
              subMenuId: item.subMenuId,
            }));
          } else {
            // Already in old format (with or without icon)
            this.currenusermenusub = subMenuData.map((item: any) => ({
              ...item,
              icon: item.icon || 'pi-circle', // Ensure icon is present
            }));
          }
        } else {
          this.currenusermenusub = [];
        }
      }

      // Load level2 menu (table3) - check if already in old format or needs transformation
      const currentUserMenusubLevel2 = sessionStorage.getItem('CurrentUserMenusub_level2');
      if (currentUserMenusubLevel2) {
        const level2Data = JSON.parse(currentUserMenusubLevel2);
        if (Array.isArray(level2Data)) {
          // Check if already in old format (has 'activity' property) or needs transformation
          if (level2Data.length > 0 && level2Data[0].level2MenuName) {
            // New format - transform to old format with icon
            this.CurrentUserMenusub_level2 = level2Data.map((item: any) => ({
              menu: item.subMenuId,
              activity: item.level2MenuName,
              formValue: item.route || '',
              callingPage: item.route || '',
              menuflag: '1',
              icon: item.icon || 'pi-circle',
              level2MenuId: item.level2MenuId,
            }));
          } else {
            // Already in old format (with or without icon)
            this.CurrentUserMenusub_level2 = level2Data.map((item: any) => ({
              ...item,
              icon: item.icon || 'pi-circle', // Ensure icon is present
            }));
          }
        } else {
          this.CurrentUserMenusub_level2 = [];
        }
      }

      // Initialize submenu state
      const state: { [key: string]: boolean } = {};
      [...this.currentusermenu, ...this.currenusermenusub, ...this.CurrentUserMenusub_level2].forEach((item: any) => {
        if (item.menu) state[item.menu] = false;
        if (item.activity) state[item.activity] = false;
      });
      this.submenus.set(state);

      this.isLoading.set(false);
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading menu data from sessionStorage:', error);
      // Clear menu on error
      this.currentusermenu = [];
      this.currenusermenusub = [];
      this.CurrentUserMenusub_level2 = [];
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
  }


  /**
   * Check if menu has submenu
   */
  hasSubmenu(menu: string): boolean {
    return this.currenusermenusub.some((sub) => sub.menu === menu);
  }

  /**
   * Get submenus for a menu
   */
  getSubmenus(menu: string): SubMenuItem[] {
    return this.currenusermenusub.filter((sub) => sub.menu === menu);
  }

  /**
   * Check if submenu has level 2 submenu
   */
  hasSubmenuLevel2(activity: string): boolean {
    return this.CurrentUserMenusub_level2.some((lvl2) => lvl2.menu === activity);
  }

  /**
   * Get level 2 submenus for a submenu
   */
  getSubmenuLevel2(activity: string): Level2MenuItem[] {
    return this.CurrentUserMenusub_level2.filter((lvl2) => lvl2.menu === activity);
  }

  /**
   * Check if submenu is open
   */
  isSubmenuOpen(name: string): boolean {
    return this.submenus()[name] || false;
  }

  /**
   * Toggle submenu
   */
  toggleSubmenu(name: string, accordion = false): void {
    this.submenus.update((state) => {
      const newState: { [key: string]: boolean } = {};
      if (accordion) {
        // Close all when opening a top-level menu
        Object.keys(state).forEach((k) => (newState[k] = false));
      } else {
        Object.assign(newState, state);
      }

      newState[name] = !state[name];
      return newState;
    });
    this.cdr.markForCheck();
  }

  /**
   * Action method for navigation
   * Old structure के अनुसार navigation handle करता है
   */
  action(menu: string, page: string, form: string, formValue: string): void {
    // Set dynamic form params
    const objList = {
      formName: form,
      formValue: formValue,
      menu: menu,
    };
    this.userService.Setdynamicformparam(JSON.stringify(objList));

    // Save to sessionStorage
    if (!sessionStorage['menuItem']) {
      sessionStorage.setItem('menuItem', JSON.stringify(objList));
    } else {
      sessionStorage.removeItem('menuItem');
      sessionStorage.setItem('menuItem', JSON.stringify(objList));
    }

    // Navigate based on page type
    if (page === 'MasterForm' || page === 'ReportForm' || page === 'CustomForm') {
      this.router.navigate(['/Loading']).then(() => {
        this.router.navigate(['/' + page]);
      });
    } else {
      this.router.navigate(['/' + page]);
    }

    // Toggle submenu state
    this.submenus.update((state) => {
      const newState: { [key: string]: boolean } = { ...state };
      newState[form] = !state[form];
      return newState;
    });
    this.cdr.markForCheck();
  }

  /**
   * Set Submenu Item - Convert form type to page
   */
  setSubmenuItem(type: string, defaultmenu = ''): string {
    if (type === 'M') {
      return 'MasterForm';
    }
    if (type === 'T') {
      return 'CustomForm';
    }
    if (type === 'R') {
      return 'ReportForm';
    }
    return defaultmenu;
  }

  /**
   * Hover menu handler (for collapsed sidebar)
   */
  onHoverMenu(menuName: string, event: MouseEvent): void {
    if (!this.sidebarOpen()) {
      this.hoveredMenuSubmenus = this.getSubmenus(menuName);
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.hoverMenuPosition = { top: rect.top, left: rect.right + 5 };
      this.cdr.markForCheck();
    }
  }

  /**
   * Leave menu handler
   */
  onLeaveMenu(): void {
    setTimeout(() => {
      if (!this.hoveredOverPopup) this.clearHover();
    }, 200);
  }

  /**
   * Keep hover state
   */
  keepHover(): void {
    this.hoveredOverPopup = true;
  }

  /**
   * Clear hover state
   */
  clearHover(): void {
    this.hoveredOverPopup = false;
    this.hoveredMenuSubmenus = [];
    this.hoverMenuPosition = null;
    this.cdr.markForCheck();
  }

  /**
   * Close sidebar on mobile
   */
  closeSidebarOnMobile(): void {
    if (window.innerWidth < 768) {
      this.toggleSidebar.emit();
    }
  }
}