import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Sidebar state management using Signals
  private readonly sidebarState = signal<boolean>(true);

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
}

