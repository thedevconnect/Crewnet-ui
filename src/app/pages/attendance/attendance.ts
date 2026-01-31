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
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule, TooltipModule, DatePipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
  providers: [MessageService],
})
export class Attendance implements OnInit, OnDestroy {
  attendanceService = inject(AttendanceService);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  loadingSwipeIn = signal(false);
  loadingSwipeOut = signal(false);
  loadingStatus = signal(false);

  todayStatus = signal<TodayStatusResponse | null>(null);

  /** TIMER */
  elapsedTime = signal('00:00:00');
  private timerInterval: any = null;
  private swipeInTime: Date | null = null;
  private skipTimerRestart = false; // Flag to prevent timer restart
  private previousTimeInSeconds = 0; // Previous completed sessions time

  /** CLOCK */
  currentTime = signal('00:00:00');
  currentDate = signal(new Date());
  private clockInterval: any = null;

  /** RECORDS */
  attendanceRecords = signal<any[]>([]);
  totalTime = signal('0h 0m');

  /* ---------------------------------- INIT ---------------------------------- */

  ngOnInit(): void {
    this.startClock();
    this.loadTodayStatus(); // 🔥 MUST
  }

  /* ---------------------------------- CLOCK --------------------------------- */

  startClock(): void {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock(): void {
    const now = new Date();
    this.currentDate.set(now);
    this.currentTime.set(
      `${String(now.getHours()).padStart(2, '0')}:` +
      `${String(now.getMinutes()).padStart(2, '0')}:` +
      `${String(now.getSeconds()).padStart(2, '0')}`
    );
  }

  /* -------------------------------- EMPLOYEE -------------------------------- */

  getEmployeeId(): number {
    const user = this.authService.getCurrentUser()();
    return user?.id ? Number(user.id) : 0;
  }

  /* ----------------------------- LOAD STATUS -------------------------------- */

  loadTodayStatus(): void {
    const empId = this.getEmployeeId();
    if (!empId) return;

    this.loadingStatus.set(true);

    this.attendanceService.getTodayStatus(empId).subscribe({
      next: (res: TodayStatusResponse) => {
        this.todayStatus.set(res);
        this.loadingStatus.set(false);

        this.attendanceRecords.set(res.records || []);
        this.totalTime.set(res.total_time?.formatted || '0h 0m');

        // Calculate previous time from completed sessions
        const hours = res.total_time?.hours || 0;
        const minutes = res.total_time?.minutes || 0;
        this.previousTimeInSeconds = hours * 3600 + minutes * 60;

        // 🔥 Don't touch timer if we just started it manually
        if (this.skipTimerRestart) {
          this.skipTimerRestart = false; // Reset flag after using
          return;
        }

        // Resume timer if status is IN and we have last_swipe_in time
        if (res.status === 'IN') {
          // If timer is already running, keep it
          if (this.timerInterval) {
            return;
          }

          // Start timer using last_swipe_in (most recent swipe in)
          if (res.last_swipe_in) {
            this.startTimer(new Date(res.last_swipe_in));
          }
        } else {
          // Status is OUT - show total time and stop timer
          this.displayTotalTime();
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
          }
          this.swipeInTime = null;
        }
      },
      error: () => {
        this.loadingStatus.set(false);
        this.stopTimer();
      },
    });
  }

  refreshAttendance(): void {
    this.loadTodayStatus();
  }

  /* ------------------------------- SWIPE IN --------------------------------- */

  doSwipeIn(): void {
    const empId = this.getEmployeeId();
    if (!empId) return;

    this.loadingSwipeIn.set(true);
    const swipeTime = new Date();

    this.attendanceService.swipeIn(empId).subscribe({
      next: () => {
        this.todayStatus.set({
          success: true,
          status: 'IN',
          swipe_in_time: swipeTime.toISOString(),
          swipe_out_time: null,
        });

        // ✅ Start timer immediately and set flag to prevent restart
        this.skipTimerRestart = true;
        this.startTimer(swipeTime);

        // Reload status after brief delay
        setTimeout(() => {
          this.loadTodayStatus();
        }, 500);
      },
      complete: () => this.loadingSwipeIn.set(false),
    });
  }

  /* ------------------------------- SWIPE OUT -------------------------------- */

  doSwipeOut(): void {
    const empId = this.getEmployeeId();
    if (!empId) return;

    this.loadingSwipeOut.set(true);

    this.attendanceService.swipeOut(empId).subscribe({
      next: () => {
        // Stop timer but keep showing total time (don't reset to 00:00:00)
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.swipeInTime = null;

        // Reload status to get updated total_time
        setTimeout(() => this.loadTodayStatus(), 400);
      },
      complete: () => this.loadingSwipeOut.set(false),
    });
  }

  /* -------------------------------- TIMER ----------------------------------- */

  startTimer(start: Date): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.swipeInTime = start;

    const tick = () => {
      if (!this.swipeInTime) return;

      // Current session elapsed time in milliseconds
      const currentSessionMs = Date.now() - this.swipeInTime.getTime();
      const currentSessionSeconds = Math.floor(currentSessionMs / 1000);

      // Total time = previous completed sessions + current session
      const totalSeconds = this.previousTimeInSeconds + currentSessionSeconds;

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      this.elapsedTime.set(
        `${String(h).padStart(2, '0')}:` +
        `${String(m).padStart(2, '0')}:` +
        `${String(s).padStart(2, '0')}`
      );
    };

    tick(); // Initial tick
    this.timerInterval = setInterval(tick, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.swipeInTime = null;
    this.previousTimeInSeconds = 0;
    this.elapsedTime.set('00:00:00');
  }

  displayTotalTime(): void {
    // Display the total completed time (when status is OUT)
    const h = Math.floor(this.previousTimeInSeconds / 3600);
    const m = Math.floor((this.previousTimeInSeconds % 3600) / 60);
    const s = this.previousTimeInSeconds % 60;

    this.elapsedTime.set(
      `${String(h).padStart(2, '0')}:` +
      `${String(m).padStart(2, '0')}:` +
      `${String(s).padStart(2, '0')}`
    );
  }

  /* -------------------------------- FORMAT ---------------------------------- */

  formatTime(date: string): string {
    const d = new Date(date);
    return (
      `${String(d.getHours()).padStart(2, '0')}:` +
      `${String(d.getMinutes()).padStart(2, '0')}:` +
      `${String(d.getSeconds()).padStart(2, '0')}`
    );
  }

  /* -------------------------------- DESTROY --------------------------------- */

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}
