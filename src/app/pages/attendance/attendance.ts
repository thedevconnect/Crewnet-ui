import { Component, inject, signal, OnInit } from '@angular/core';
import { AttendanceService, TodayStatusResponse } from '../../services/attendance.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, Button, Card, ToastModule, DatePipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  providers: [MessageService]
})
export class Attendance implements OnInit {

  attendanceService = inject(AttendanceService);
  messageService = inject(MessageService);

  loadingSwipeIn = signal(false);
  loadingSwipeOut = signal(false);
  loadingStatus = signal(false);

  todayStatus = signal<TodayStatusResponse | null>(null);

  ngOnInit(): void {
    this.loadTodayStatus();
  }

  loadTodayStatus() {
    this.loadingStatus.set(true);
    this.attendanceService.getTodayStatus().subscribe({
      next: (res: TodayStatusResponse) => {
        this.todayStatus.set(res);
        this.loadingStatus.set(false);
      },
      error: (error: any) => {
        console.error('Error loading attendance status:', error);
        
        // Set status from error response if available (for 404 with default response)
        if (error.canSwipeIn !== undefined) {
          this.todayStatus.set({
            canSwipeIn: error.canSwipeIn,
            canSwipeOut: error.canSwipeOut || false
          });
          
          // Show warning instead of error for 404
          if (error.message && error.message.includes('not available')) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: error.message,
              life: 5000
            });
          }
        } else {
          // Set default status for other errors
          this.todayStatus.set({
            canSwipeIn: false,
            canSwipeOut: false
          });
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to load attendance status. Please try again.'
          });
        }
        
        this.loadingStatus.set(false);
      }
    });
  }

  doSwipeIn() {
    if (!this.todayStatus()?.canSwipeIn) {
      return;
    }

    this.loadingSwipeIn.set(true);

    this.attendanceService.swipeIn().subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Swipe In Successful!'
        });
        this.loadTodayStatus();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Swipe In Failed! Please try again.'
        });
        this.loadingSwipeIn.set(false);
      },
      complete: () => this.loadingSwipeIn.set(false)
    });
  }

  doSwipeOut() {
    if (!this.todayStatus()?.canSwipeOut) {
      return;
    }

    this.loadingSwipeOut.set(true);

    this.attendanceService.swipeOut().subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Swipe Out Successful!'
        });
        this.loadTodayStatus();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Swipe Out Failed! Please try again.'
        });
        this.loadingSwipeOut.set(false);
      },
      complete: () => this.loadingSwipeOut.set(false)
    });
  }
  // Swipe related variables
  startX = 0;
  currentX = 0;
  dragging = false;
  activeType: 'IN' | 'OUT' | null = null;

  // Start swipe
  startDrag(event: any, type: 'IN' | 'OUT') {
    this.dragging = true;
    this.startX = event.clientX;
    this.activeType = type;
  }

  // During swipe
  onDrag(event: any) {
    if (!this.dragging) return;
    this.currentX = event.clientX - this.startX;
  }

  // End swipe
  endDrag() {
    if (!this.dragging) return;

    // 👉 Swipe IN (Right swipe)
    if (this.currentX > 120 && this.activeType === 'IN') {
      if (this.todayStatus()?.canSwipeIn) {
        this.doSwipeIn();
      }
    }

    // 👉 Swipe OUT (Left swipe)
    if (this.currentX < -120 && this.activeType === 'OUT') {
      if (this.todayStatus()?.canSwipeOut) {
        this.doSwipeOut();
      }
    }

    this.resetSwipe();
  }

  resetSwipe() {
    this.dragging = false;
    this.currentX = 0;
    this.activeType = null;
  }

}

