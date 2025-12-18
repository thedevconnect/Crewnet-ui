import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

export interface TodayStatusResponse {
  canSwipeIn: boolean;
  canSwipeOut: boolean;
  attendance?: {
    id: number;
    swipeIn?: string;
    swipeOut?: string;
    date: string;
    status?: string;
  };
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';
  private readonly apiUrl = `${this.baseUrl}/attendance`;

  swipeIn(): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/swipe-in`, {}).pipe(
      catchError(error => {
        console.error('Swipe In error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.message || error.message || 'Swipe In failed. Please try again.'
        }));
      })
    );
  }

  swipeOut(): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/swipe-out`, {}).pipe(
      catchError(error => {
        console.error('Swipe Out error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.message || error.message || 'Swipe Out failed. Please try again.'
        }));
      })
    );
  }

  getTodayStatus(): Observable<TodayStatusResponse> {
    return this.http.get<{ success: boolean; data: TodayStatusResponse }>(`${this.apiUrl}/today-status`).pipe(
      map(response => {
        // Handle both response formats: {success, data} or direct data
        if (response && 'data' in response) {
          return response.data || response as any;
        }
        return response as any;
      }),
      catchError(error => {
        console.error('Get Today Status error:', error);
        
        // Handle 404 - endpoint not found
        if (error.status === 404) {
          console.warn('Attendance endpoint not found. Backend may not have this route implemented yet.');
          // Return default response that allows actions
          return throwError(() => ({
            canSwipeIn: true,
            canSwipeOut: false,
            message: 'Attendance endpoint not available. Please check backend configuration.'
          }));
        }
        
        return throwError(() => ({
          canSwipeIn: false,
          canSwipeOut: false,
          message: error.error?.message || error.message || 'Failed to fetch attendance status.'
        }));
      })
    );
  }
}

