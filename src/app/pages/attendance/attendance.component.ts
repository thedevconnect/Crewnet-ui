import { Component, inject, signal, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule, Button, Card],
  templateUrl: './attendance.component.html'
})
export class AttendanceComponent implements OnInit {

  attendanceService = inject(AttendanceService);

  loadingSwipeIn = signal(false);
  loadingSwipeOut = signal(false);

  todayStatus = signal<any>(null);

  ngOnInit(): void {
    this.loadTodayStatus();
  }

  loadTodayStatus() {
    this.attendanceService.getTodayStatus().subscribe((res: any) => {
      this.todayStatus.set(res);
    });
  }

  doSwipeIn() {
    this.loadingSwipeIn.set(true);

    this.attendanceService.swipeIn().subscribe({
      next: (res: any) => {
        alert('Swipe In Successful!');
        this.loadTodayStatus();
      },
      error: () => alert('Swipe In Failed!'),
      complete: () => this.loadingSwipeIn.set(false)
    });
  }

  doSwipeOut() {
    this.loadingSwipeOut.set(true);

    this.attendanceService.swipeOut().subscribe({
      next: (res: any) => {
        alert('Swipe Out Successful!');
        this.loadTodayStatus();
      },
      error: () => alert('Swipe Out Failed!'),
      complete: () => this.loadingSwipeOut.set(false)
    });
  }
}

