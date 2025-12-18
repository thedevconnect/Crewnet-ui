import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Employee } from '../models/employee.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface EmployeesResponse {
  employees: Employee[];
  total?: number;
  page?: number;
  limit?: number;
}

interface EmployeeResponse {
  employee: Employee;
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';
  private readonly apiUrl = `${this.baseUrl}/employees`;

  getAll(params?: EmployeeQueryParams): Observable<{ employees: Employee[]; total?: number; page?: number; limit?: number }> {
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

    return this.http.get<ApiResponse<EmployeesResponse>>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        const employees = (response.data?.employees || Array.isArray(response.data) ? response.data : []) as Employee[];
        // Format joiningDate to YYYY-MM-DD format
        const formattedEmployees = employees.map(emp => ({
          ...emp,
          joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : emp.joiningDate
        }));
        return {
          employees: formattedEmployees,
          total: response.data?.total,
          page: response.data?.page || params?.page,
          limit: response.data?.limit || params?.limit,
        };
      }),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<ApiResponse<EmployeeResponse | Employee>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as Employee;
        // Format joiningDate to YYYY-MM-DD format
        return {
          ...employee,
          joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : employee.joiningDate
        };
      }),
      catchError(error => {
        console.error(`Error fetching employee ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  create(payload: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<ApiResponse<EmployeeResponse | Employee>>(this.apiUrl, payload).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as Employee;
        return {
          ...employee,
          joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : employee.joiningDate
        };
      }),
      catchError(error => {
        console.error('Error creating employee:', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, payload: Partial<Employee>): Observable<Employee> {
    return this.http.put<ApiResponse<EmployeeResponse | Employee>>(`${this.apiUrl}/${id}`, payload).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as Employee;
        return {
          ...employee,
          joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : employee.joiningDate
        };
      }),
      catchError(error => {
        console.error(`Error updating employee ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        success: response.success,
        message: response.message,
      })),
      catchError(error => {
        console.error(`Error deleting employee ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
