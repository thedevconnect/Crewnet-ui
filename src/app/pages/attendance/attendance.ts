import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { AttendanceService, TodayStatusResponse } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';  

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule, TooltipModule, DatePipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
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

  // Attendance records from API
  attendanceRecords = signal<Array<{
    id: number;
    employee_id: number;
    swipe_in_time: string;
    swipe_out_time?: string | null;
    duration?: string;
    status: 'IN' | 'OUT';
  }>>([]);
  totalTime = signal<string>('0h 0m');

  ngOnInit(): void {
    // Initialize with default NOT_SWIPED status
    this.todayStatus.set({
      success: true,
      status: 'NOT_SWIPED' as const,
      message: 'Ready to swipe in'
    });
    this.startTimeUpdate();
    // Don't call API on page load - only on Swipe In button click
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
      const employeeId = parseInt(user.id, 10);
      if (isNaN(employeeId)) {
        console.error('Invalid employee ID from user:', user.id);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid employee ID. Please contact administrator.'
        });
        return 0; // Return 0 to trigger error
      }
      return employeeId;
    }
    // If no user, show error
    console.error('No user found in auth service');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'User not authenticated. Please login again.'
    });
    return 0; // Return 0 to trigger error
  }

  loadTodayStatus(): void {
    this.loadingStatus.set(true);
    const employeeId = this.getEmployeeId();

    this.attendanceService.getTodayStatus(employeeId).subscribe({
      next: (res: TodayStatusResponse) => {
        this.todayStatus.set(res);
        this.loadingStatus.set(false);

        // Update records from API response
        if (res.records && res.records.length > 0) {
          this.attendanceRecords.set(res.records);
        } else {
          this.attendanceRecords.set([]);
        }

        // Update total time
        if (res.total_time?.formatted) {
          this.totalTime.set(res.total_time.formatted);
        } else {
          this.totalTime.set('0h 0m');
        }

        // Start timer if swipe in is done but swipe out is not
        if (res.status === 'IN' && res.swipe_in_time) {
          this.startTimer(new Date(res.swipe_in_time));
        } else {
          this.stopTimer();
          this.elapsedTime.set('00:00:00');
        }
      },
      error: (error: any) => {
        console.error('Error loading attendance status:', error);
        this.todayStatus.set({
          success: true,
          status: 'NOT_SWIPED' as const,
          message: 'No attendance record found for today'
        });
        this.loadingStatus.set(false);
        this.attendanceRecords.set([]);
        this.totalTime.set('0h 0m');
        this.stopTimer();
        this.elapsedTime.set('00:00:00');
      }
    });
  }

  refreshAttendance(): void {
    this.loadTodayStatus();
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshed',
      detail: 'Attendance data refreshed'
    });
  }


  doSwipeIn(): void {
    this.loadingSwipeIn.set(true);
    const employeeId = this.getEmployeeId();
    
    if (!employeeId || employeeId === 0) {
      this.loadingSwipeIn.set(false);
      return;
    }
    
    const swipeInTime = new Date();

    this.attendanceService.swipeIn(employeeId).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Swipe In Successful!'
        });
        // Reset timer first
        this.stopTimer();
        // Update status immediately to change button
        this.todayStatus.set({
          success: true,
          status: 'IN',
          swipe_in_time: swipeInTime.toISOString(),
          swipe_out_time: null
        });
        // Start timer immediately with fresh start
        this.startTimer(swipeInTime);
        // Reload status to get full data
        this.loadTodayStatus();
      },
      error: (error: any) => {
        let errorMessage = 'Swipe In Failed! Please try again.';
        
        if (error.status === 404) {
          errorMessage = 'Attendance endpoint not found. Please check backend server configuration.';
        } else if (error.error?.error) {
          errorMessage = error.error.error;
          // Special handling for "Employee not found"
          if (error.error.error === 'Employee not found') {
            errorMessage = 'Employee not found. Please ensure your employee profile is set up correctly.';
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
        this.loadingSwipeIn.set(false);
      },
      complete: () => this.loadingSwipeIn.set(false)
    });
  }

  doSwipeOut(): void {
    if (this.todayStatus()?.status !== 'IN') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please swipe in first!'
      });
      return;
    }

    this.loadingSwipeOut.set(true);
    const employeeId = this.getEmployeeId();
    
    if (!employeeId || employeeId === 0) {
      this.loadingSwipeOut.set(false);
      return;
    }

    this.attendanceService.swipeOut(employeeId).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Swipe Out Successful!'
        });
        // Stop timer and reset to 00:00:00
        this.stopTimer();
        this.elapsedTime.set('00:00:00');
        // Reload status to update UI
        this.loadTodayStatus();
      },
      error: (error: any) => {
        let errorMessage = 'Swipe Out Failed! Please try again.';
        
        if (error.status === 404) {
          errorMessage = 'Attendance endpoint not found. Please check backend server configuration.';
        } else if (error.error?.error) {
          errorMessage = error.error.error;
          // Special handling for "Employee not found"
          if (error.error.error === 'Employee not found') {
            errorMessage = 'Employee not found. Please ensure your employee profile is set up correctly.';
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
        this.loadingSwipeOut.set(false);
      },
      complete: () => {
        this.loadingSwipeOut.set(false);
      }
    });
  }


  startTimer(swipeInTime: Date): void {
    this.swipeInTime = swipeInTime;
    this.stopTimer(); // Clear any existing timer

    // Update immediately
    const now = new Date();
    const diff = now.getTime() - swipeInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    this.elapsedTime.set(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );

    // Then update every second
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
    this.elapsedTime.set('00:00:00');
  }

  getElapsedHours(): string {
    const time = this.elapsedTime();
    const parts = time.split(':');
    return parts[0] || '00';
  }

  getElapsedMinutes(): string {
    const time = this.elapsedTime();
    const parts = time.split(':');
    return parts[1] || '00';
  }

  getElapsedSeconds(): string {
    const time = this.elapsedTime();
    const parts = time.split(':');
    return parts[2] || '00';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  getTotalDuration(): string {
    const status = this.todayStatus();
    if (status?.swipe_in_time && status?.swipe_out_time) {
      const swipeIn = new Date(status.swipe_in_time);
      const swipeOut = new Date(status.swipe_out_time);
      const diff = swipeOut.getTime() - swipeIn.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
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
