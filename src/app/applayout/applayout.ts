import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../shared/user-service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

/**
 * AppLayout Component
 * Main layout component जो sidebar, header, और main content area को manage करता है
 * Mobile responsive design के साथ
 */
@Component({
  selector: 'app-applayout',
  imports: [CommonModule, Sidebar, Header, RouterOutlet, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  templateUrl: './applayout.html',
  styleUrl: './applayout.scss'
})
export class Applayout implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  /**
   * Is Sidebar Open - Sidebar का current state return करता है
   * @returns boolean - true अगर sidebar open है
   */
  isSidebarOpen(): boolean {
    return this.userService.sidebarState();
  }

  /**
   * Toggle Sidebar - Sidebar को open/close करता है
   * Signal update method का उपयोग करता है
   */
  toggleSidebar(): void {
    this.userService.sidebarState.update(open => !open);
  }
}
