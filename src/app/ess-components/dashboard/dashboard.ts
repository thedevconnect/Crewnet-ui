import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardService, DashboardResponse } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-ess-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EssDashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  // State signals
  dashboardData = signal<DashboardResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedMonth = signal<number | null>(null);
  selectedYear = signal<number | null>(null);

  // Computed properties
  summary = computed(() => this.dashboardData()?.data?.summary);
  currentMonth = computed(() => this.dashboardData()?.data?.currentMonth);
  lastMonth = computed(() => this.dashboardData()?.data?.lastMonth);
  dayWise = computed(() => this.dashboardData()?.data?.dayWise || []);
  departmentWise = computed(() => this.dashboardData()?.data?.departmentWise || []);
  leaveStats = computed(() => this.dashboardData()?.data?.leaveStats || []);
  holidayStats = computed(() => this.dashboardData()?.data?.holidayStats);
  employeeBreakdown = computed(() => this.dashboardData()?.data?.employeeBreakdown || []);

  // Helper computed properties
  attendancePercentage = computed(() => {
    const summary = this.summary();
    if (!summary) return 0;
    return summary.totalEmployees > 0
      ? Math.round((summary.todaySwipeIns / summary.totalEmployees) * 100)
      : 0;
  });

  avgWorkingHours = computed(() => {
    const stats = this.currentMonth()?.stats;
    if (!stats) return 0;
    return Math.round(stats.avgWorkingMinutes / 60 * 10) / 10; // Round to 1 decimal
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(month?: number, year?: number): void {
    this.loading.set(true);
    this.error.set(null);

    const currentDate = new Date();
    const requestMonth = month ?? currentDate.getMonth() + 1;
    const requestYear = year ?? currentDate.getFullYear();

    this.selectedMonth.set(requestMonth);
    this.selectedYear.set(requestYear);

    this.dashboardService.getDashboard(requestMonth, requestYear).subscribe({
      next: (response: DashboardResponse) => {
        this.dashboardData.set(response);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err.error?.error || 'Failed to load dashboard data');
        this.loading.set(false);
        console.error('Dashboard loading error:', err);
      }
    });
  }

  getComparisonClass(changeType: string): string {
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  }

  getComparisonIcon(changeType: string): string {
    return changeType === 'increase' ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}
