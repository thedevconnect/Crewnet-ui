import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly isOpen = input<boolean>(true);
  readonly menuItems = input.required<MenuItem[]>();
  readonly teams = input<Array<{ name: string; initial: string }>>([]);
  readonly toggleSidebar = output<void>();

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}

