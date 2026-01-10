import { Component, ChangeDetectionStrategy, signal, ChangeDetectorRef, input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../shared/user-service';

/**
 * Sidebar Component
 * Multi-level sidebar menu with hierarchical structure
 * ChangeDetectionStrategy.OnPush का उपयोग performance optimization के लिए
 * SessionStorage से menu data load करता है (CurrentUserMenu, CurrentUserMenusub, CurrentUserMenusub_level2)
 */
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SkeletonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  isSidebarOpen = input<boolean>(true);
  
  // Menu data arrays - sessionStorage से load होगा
  currentusermenu: any[] = [];
  currenusermenusub: any[] = [];
  CurrentUserMenusub_level2: any[] = [];

  // Submenu state management - Signal का उपयोग
  private submenus = signal<{ [key: string]: boolean }>({});

  // Event subscription - Memory leak prevention के लिए
  private eventSub!: Subscription;

  // Hover popup state (collapsed sidebar के लिए)
  hoveredMenuSubmenus: any[] = [];
  hoverMenuPosition: { top: number; left: number } | null = null;
  hoveredOverPopup = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initial menu data load
    this.loadMenuData();

    // Subscribe to UserService events - NAV_BAR event पर menu reload होगा
    this.eventSub = this.userService.currentEvent.subscribe((evt: any) => {
      if (evt && evt.eventName === 'NAV_BAR') {
        this.loadMenuData();
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    // Memory leak prevention - Subscription unsubscribe करना जरूरी है
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }

  /**
   * Load Menu Data - sessionStorage से menu data load करता है
   * CurrentUserMenu, CurrentUserMenusub, CurrentUserMenusub_level2 keys का उपयोग करता है
   */
  loadMenuData(): void {
    try {
      // Main menu items (table1)
      this.currentusermenu = JSON.parse(sessionStorage.getItem('CurrentUserMenu') || '[]');
      
      // Submenu items (table2)
      this.currenusermenusub = JSON.parse(sessionStorage.getItem('CurrentUserMenusub') || '[]');
      
      // Level 2 submenu items (table3)
      this.CurrentUserMenusub_level2 = JSON.parse(sessionStorage.getItem('CurrentUserMenusub_level2') || '[]');
      
      // Initialize submenu state - सभी menus को initially closed रखता है
      const state: { [key: string]: boolean } = {};
      [...this.currentusermenu, ...this.currenusermenusub, ...this.CurrentUserMenusub_level2].forEach((item: any) => {
        if (item.menu) state[item.menu] = false;
        if (item.activity) state[item.activity] = false;
      });
      this.submenus.set(state);
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading menu data:', error);
      // Error होने पर empty arrays set करता है
      this.currentusermenu = [];
      this.currenusermenusub = [];
      this.CurrentUserMenusub_level2 = [];
      this.cdr.markForCheck();
    }
  }

  /**
   * Has Submenu - Check करता है कि menu के पास submenu है या नहीं
   * @param menu - Menu name string
   * @returns boolean - true अगर submenu है
   */
  hasSubmenu(menu: string): boolean {
    return this.currenusermenusub.some((sub: any) => sub.menu === menu);
  }

  /**
   * Get Submenus - Specific menu के सभी submenus return करता है
   * @param menu - Menu name string
   * @returns array - Submenu items array
   */
  getSubmenus(menu: string): any[] {
    return this.currenusermenusub.filter((sub: any) => sub.menu === menu);
  }

  /**
   * Has Submenu Level 2 - Check करता है कि submenu के पास level 2 submenu है या नहीं
   * @param submenu - Submenu name string
   * @returns boolean - true अगर level 2 submenu है
   */
  hasSubmenuLevel2(submenu: string): boolean {
    return this.CurrentUserMenusub_level2.some((lvl2: any) => lvl2.menu === submenu);
  }

  /**
   * Get Submenu Level 2 - Specific submenu के सभी level 2 submenus return करता है
   * @param submenu - Submenu name string
   * @returns array - Level 2 submenu items array
   */
  getSubmenuLevel2(submenu: string): any[] {
    return this.CurrentUserMenusub_level2.filter((lvl2: any) => lvl2.menu === submenu);
  }

  /**
   * Toggle Submenu - Submenu को expand/collapse करता है
   * Accordion mode: एक menu open होने पर दूसरे close हो जाते हैं
   * @param name - Menu/submenu name
   * @param accordion - true अगर accordion mode चाहिए
   */
  toggleSubmenu(name: string, accordion = false): void {
    this.submenus.update(state => {
      const newState: { [key: string]: boolean } = {};
      
      // Accordion mode: सभी menus को close करता है
      if (accordion) {
        Object.keys(state).forEach(k => (newState[k] = false));
      } else {
        Object.assign(newState, state);
      }
      
      // Toggle current menu state
      newState[name] = !state[name];
      return newState;
    });
  }

  /**
   * Is Submenu Open - Check करता है कि submenu open है या नहीं
   * @param name - Menu/submenu name
   * @returns boolean - true अगर open है
   */
  isSubmenuOpen(name: string): boolean {
    return this.submenus()[name] || false;
  }

  /**
   * Action - Menu item click पर navigation handle करता है
   * Form data को sessionStorage में save करता है और appropriate route पर navigate करता है
   * @param menu - Menu name
   * @param page - Page route
   * @param form - Form name
   * @param formValue - Form value
   */
  action(menu: string, page: string, form: string, formValue: string): void {
    // Menu item data को sessionStorage में save करता है
    const menuItem = { formName: form, formValue: formValue, menu: menu };
    sessionStorage.setItem('menuItem', JSON.stringify(menuItem));
    
    // Page type के according navigate करता है
    if (page === 'MasterForm' || page === 'ReportForm' || page === 'CustomForm') {
      // Loading page से होकर navigate करता है
      this.router.navigate(['/Loading']).then(() => this.router.navigate(['/' + page]));
    } else {
      // Direct navigate
      this.router.navigate(['/' + page]);
    }
    
    // Mobile पर sidebar close करता है
    if (window.innerWidth < 768) {
      this.toggleSidebar.emit();
    }
  }

  /**
   * Set Submenu Item - Submenu type के according page route return करता है
   * @param type - Menu type (M: MasterForm, T: CustomForm, R: ReportForm)
   * @param defaultmenu - Default menu route
   * @returns string - Page route string
   */
  setSubmenuItem(type: string, defaultmenu = ''): string {
    if (type === 'M') return 'MasterForm';
    if (type === 'T') return 'CustomForm';
    if (type === 'R') return 'ReportForm';
    return defaultmenu;
  }

  /**
   * On Hover Menu - Collapsed sidebar पर hover होने पर popup show करता है
   * @param menuName - Menu name
   * @param event - Mouse event
   */
  onHoverMenu(menuName: string, event: MouseEvent): void {
    if (!this.isSidebarOpen()) {
      this.hoveredMenuSubmenus = this.getSubmenus(menuName);
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.hoverMenuPosition = { top: rect.top, left: rect.right + 5 };
    }
  }

  /**
   * On Leave Menu - Mouse leave होने पर popup hide करता है
   * Delay के साथ ताकि popup पर hover करने का time मिले
   */
  onLeaveMenu(): void {
    setTimeout(() => {
      if (!this.hoveredOverPopup) {
        this.clearHover();
      }
    }, 200);
  }

  /**
   * Keep Hover - Popup पर hover होने पर state maintain करता है
   */
  keepHover(): void {
    this.hoveredOverPopup = true;
  }

  /**
   * Clear Hover - Hover state को clear करता है
   */
  clearHover(): void {
    this.hoveredOverPopup = false;
    this.hoveredMenuSubmenus = [];
    this.hoverMenuPosition = null;
  }
}
