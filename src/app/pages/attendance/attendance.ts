import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { AttendanceService, TodayStatusResponse } from '../../core/services/attendance.service';
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
export class Attendance implements OnInit, OnDestroy {

  attendanceService = inject(AttendanceService);
  messageService = inject(MessageService);

  loadingSwipeIn = signal(false);
  loadingSwipeOut = signal(false);
  loadingStatus = signal(false);

  todayStatus = signal<TodayStatusResponse | null>(null);
  
  // Timer functionality
  elapsedTime = signal<string>('00:00:00');
  private timerInterval: any = null;
  private swipeInTime: Date | null = null;
  
  // Current date and time
  currentDate = signal<Date>(new Date());
  currentTime = signal<string>('00:00:00');
  private timeInterval: any = null;
  
  // Geolocation
  geolocationBlocked = signal<boolean>(false);
  
  // Recent swipes
  recentSwipes = signal<any[] | null>(null);

  ngOnInit(): void {
    this.loadTodayStatus();
    this.startTimeUpdate();
    this.checkGeolocation();
    this.loadRecentSwipes();
  }
  
  startTimeUpdate() {
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  
  updateTime() {
    const now = new Date();
    this.currentDate.set(now);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTime.set(`${hours}:${minutes}:${seconds}`);
  }
  
  checkGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          this.geolocationBlocked.set(false);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.geolocationBlocked.set(true);
          }
        }
      );
    }
  }
  
  requestGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          this.geolocationBlocked.set(false);
          window.location.reload();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Permission Denied',
            detail: 'Please allow geolocation access in your browser settings.'
          });
        }
      );
    }
  }
  
  loadRecentSwipes() {
    // Mock data - replace with actual API call
    this.recentSwipes.set([]);
  }

  loadTodayStatus() {
    this.loadingStatus.set(true);
    this.attendanceService.getTodayStatus().subscribe({
      next: (res: TodayStatusResponse) => {
        this.todayStatus.set(res);
        this.loadingStatus.set(false);
        
        // Start timer if swipe in is done but swipe out is not
        if (res.attendance?.swipeIn && !res.attendance?.swipeOut) {
          this.startTimer(new Date(res.attendance.swipeIn));
        } else {
          this.stopTimer();
        }
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
        // Start timer immediately
        this.startTimer(new Date());
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
        // Stop timer
        this.stopTimer();
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

  startTimer(swipeInTime: Date) {
    this.swipeInTime = swipeInTime;
    this.stopTimer(); // Clear any existing timer
    
    this.timerInterval = setInterval(() => {
      if (this.swipeInTime) {
        const now = new Date();
        const diff = now.getTime() - this.swipeInTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.elapsedTime.set(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.swipeInTime = null;
  }

  getTotalDuration(): string {
    const status = this.todayStatus();
    if (status?.attendance?.swipeIn && status?.attendance?.swipeOut) {
      const swipeIn = new Date(status.attendance.swipeIn);
      const swipeOut = new Date(status.attendance.swipeOut);
      const diff = swipeOut.getTime() - swipeIn.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return '-';
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}

