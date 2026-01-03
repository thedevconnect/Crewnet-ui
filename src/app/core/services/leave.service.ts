import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Leave {
  id?: number;
  fromDate: string;
  toDate: string;
  sessionFrom: string;
  sessionTo: string;
  leaveType: string;
  reason: string;
  ccTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveResponse {
  success: boolean;
  data: Leave;
  error?: string;
}

export interface LeaveApiResponse {
  id: number;
  from_date: string;
  to_date: string;
  session_from: string;
  session_to: string;
  leave_type: string;
  reason: string;
  cc_to?: string;
  created_at: string;
  updated_at?: string;
}

export interface LeavesListResponse {
  success: boolean;
  data: {
    leaves: LeaveApiResponse[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';
  private readonly apiUrl = `${this.baseUrl}/leaves`;

  create(leave: Leave): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(this.apiUrl, leave).pipe(
      catchError(error => {
        console.error('Create leave error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to create leave'
        }));
      })
    );
  }

  getAll(params?: LeaveQueryParams): Observable<LeavesListResponse> {
    let httpParams = new HttpParams();
    
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<LeavesListResponse>(this.apiUrl, { params: httpParams }).pipe(
      catchError(error => {
        console.error('Get leaves error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to fetch leaves'
        }));
      })
    );
  }

  mapApiResponseToLeave(apiLeave: LeaveApiResponse): Leave {
    return {
      id: apiLeave.id,
      fromDate: apiLeave.from_date,
      toDate: apiLeave.to_date,
      sessionFrom: apiLeave.session_from,
      sessionTo: apiLeave.session_to,
      leaveType: apiLeave.leave_type,
      reason: apiLeave.reason,
      ccTo: apiLeave.cc_to,
      createdAt: apiLeave.created_at,
      updatedAt: apiLeave.updated_at
    };
  }

  getById(id: number): Observable<LeaveResponse> {
    return this.http.get<LeaveResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Get leave by ID error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to fetch leave'
        }));
      })
    );
  }

  update(id: number, leave: Partial<Leave>): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(`${this.apiUrl}/${id}`, leave).pipe(
      catchError(error => {
        console.error('Update leave error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to update leave'
        }));
      })
    );
  }

  delete(id: number): Observable<LeaveResponse> {
    return this.http.delete<LeaveResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Delete leave error:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.error || error.message || 'Failed to delete leave'
        }));
      })
    );
  }
}

