import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { AttendanceService, TodayStatusResponse } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule, DatePipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  providers: [MessageService]
})
export class Attendance implements OnInit, OnDestroy {

  attendanceService = inject(AttendanceService);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  loadingSwipeIn = signal(false);
  loadingSwipeOut = signal(false);
  loadingStatus = signal(false);

  todayStatus = signal<TodayStatusResponse | null>(null);

  // Timer functionality
  elapsedTime = signal<string>('00:00:00');
  private timerInterval: any = null;
  private swipeInTime: Date | null = null;

  // Current time and date
  currentTime = signal<string>('00:00:00');
  currentDate = signal<Date>(new Date());
  private timeInterval: any = null;

  ngOnInit(): void {
    this.loadTodayStatus();
    this.startTimeUpdate();
  }

  startTimeUpdate(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentDate.set(now);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTime.set(`${hours}:${minutes}:${seconds}`);
  }

  getEmployeeId(): number {
    const user = this.authService.getCurrentUser()();
    if (user && user.id) {
      return parseInt(user.id, 10);
    }
    // Default fallback - should be handled properly in production
    return 123;
  }

  loadTodayStatus(): void {
    this.loadingStatus.set(true);
    const employeeId = this.getEmployeeId();

    this.attendanceService.getTodayStatus(employeeId).subscribe({
      next: (res: TodayStatusResponse) => {
        this.todayStatus.set(res);
        this.loadingStatus.set(false);

        // Start timer if swipe in is done but swipe out is not
        if (res.swipe_in_time && !res.swipe_out_time) {
          this.startTimer(new Date(res.swipe_in_time));
        } else {
          this.stopTimer();
        }
      },
      error: (error: any) => {
        console.error('Error loading attendance status:', error);
        // This should not happen now as 404 is handled in service
        // But keep as fallback
        this.todayStatus.set({
          success: true,
          status: 'NOT_SWIPED' as const,
          message: 'No attendance record found for today'
        });
        this.loadingStatus.set(false);
      }
    });
  }

  doSwipeIn(): void {
    this.loadingSwipeIn.set(true);
    const employeeId = this.getEmployeeId();

    this.attendanceService.swipeIn(employeeId).subscribe({
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

  doSwipeOut(): void {
    this.loadingSwipeOut.set(true);
    const employeeId = this.getEmployeeId();

    this.attendanceService.swipeOut(employeeId).subscribe({
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

  startTimer(swipeInTime: Date): void {
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

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.swipeInTime = null;
  }

  getTotalDuration(): string {
    const status = this.todayStatus();
    if (status?.swipe_in_time && status?.swipe_out_time) {
      const swipeIn = new Date(status.swipe_in_time);
      const swipeOut = new Date(status.swipe_out_time);
      const diff = swipeOut.getTime() - swipeIn.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return '-';
  }


  ngOnDestroy(): void {
    this.stopTimer();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
