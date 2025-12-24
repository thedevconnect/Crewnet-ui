import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map, of } from 'rxjs';

export interface TodayStatusResponse {
  success: boolean;
  status: 'NOT_SWIPED' | 'IN' | 'OUT';
  swipe_in_time?: string;
  swipe_out_time?: string | null;
  attendance_date?: string;
  employee_id?: number;
  id?: number;
  message?: string;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    employee_id: number;
    attendance_date: string;
    swipe_in_time: string;
    swipe_out_time: string | null;
    status: 'IN' | 'OUT';
    created_at: string;
    updated_at: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  swipeIn(employeeId: number): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.baseUrl}/attendance/swipe-in`, { employeeId }).pipe(
      catchError(error => {
        console.error('Swipe In error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.message || error.message || 'Swipe In failed. Please try again.'
        }));
      })
    );
  }

  swipeOut(employeeId: number): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.baseUrl}/attendance/swipe-out`, { employeeId }).pipe(
      catchError(error => {
        console.error('Swipe Out error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.message || error.message || 'Swipe Out failed. Please try again.'
        }));
      })
    );
  }

  getTodayStatus(employeeId: number): Observable<TodayStatusResponse> {
    return this.http.get<TodayStatusResponse>(`${this.baseUrl}/attendance/today/${employeeId}`).pipe(
      catchError(error => {
        console.error('Get Today Status error:', error);
        
        // Handle 404 - no attendance record for today (treat as NOT_SWIPED)
        if (error.status === 404) {
          // Return NOT_SWIPED status instead of throwing error
          return of({
            success: true,
            status: 'NOT_SWIPED' as const,
            message: 'No attendance record found for today'
          });
        }
        
        // Handle other errors - return NOT_SWIPED status
        return of({
          success: false,
          status: 'NOT_SWIPED' as const,
          message: error.error?.message || error.message || 'Failed to fetch attendance status.'
        });
      })
    );
  }
}
