import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface TodayStats {
  total_swipe_ins: number;
  total_swipe_outs: number;
  still_inside: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  todaySwipeIns: number;
  todayStats: TodayStats;
}

export interface MonthStats {
  uniqueEmployees: number;
  workingDays: number;
  totalSwipeIns: number;
  totalSwipeOuts: number;
  avgWorkingMinutes: number;
}

export interface CurrentMonth {
  month: number;
  year: number;
  monthName: string;
  stats: MonthStats;
}

export interface ComparisonChange {
  current: number;
  last: number;
  change: number;
  changeType: 'increase' | 'decrease';
}

export interface LastMonth {
  stats: MonthStats;
  comparison: {
    uniqueEmployees: ComparisonChange;
    workingDays?: ComparisonChange;
    totalSwipeIns?: ComparisonChange;
    totalSwipeOuts?: ComparisonChange;
    avgWorkingMinutes?: ComparisonChange;
  };
}

export interface DayWiseData {
  date: string;
  swipe_in_count: number;
  total_records: number;
  swipe_out_count: number;
}

export interface DepartmentWiseData {
  department: string;
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  absent: number;
}

export interface LeaveStats {
  leaveType: string;
  count: number;
  totalDays: number;
}

export interface HolidayStats {
  totalHolidays: number;
  holidaysThisMonth: number;
  upcomingHolidays: Array<{
    date: string;
    name: string;
  }>;
}

export interface EmployeeBreakdown {
  employeeId: number;
  employeeName: string;
  department: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  totalWorkingDays: number;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    summary: DashboardSummary;
    currentMonth: CurrentMonth;
    lastMonth: LastMonth;
    dayWise: DayWiseData[];
    departmentWise: DepartmentWiseData[];
    leaveStats: LeaveStats[];
    holidayStats: HolidayStats;
    employeeBreakdown: EmployeeBreakdown[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  getDashboard(month?: number, year?: number): Observable<DashboardResponse> {
    let params = new HttpParams();
    
    if (month !== undefined) {
      params = params.set('month', month.toString());
    }
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`, { params }).pipe(
      catchError(error => {
        console.error('Get Dashboard error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.error?.message || error.message || 'Failed to fetch dashboard data.'
        }));
      })
    );
  }

  getDayWiseData(month: number, year: number): Observable<{ success: boolean; data: DayWiseData[] }> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<{ success: boolean; data: DayWiseData[] }>(`${this.baseUrl}/dashboard/day-wise`, { params }).pipe(
      catchError(error => {
        console.error('Get Day Wise Data error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to fetch day-wise data.'
        }));
      })
    );
  }

  getMonthlyComparison(month: number, year: number): Observable<{ success: boolean; data: LastMonth }> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<{ success: boolean; data: LastMonth }>(`${this.baseUrl}/dashboard/monthly`, { params }).pipe(
      catchError(error => {
        console.error('Get Monthly Comparison error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to fetch monthly comparison.'
        }));
      })
    );
  }
}

