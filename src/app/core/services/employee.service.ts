import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs'; 

interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

interface EmployeesResponse {
  employees: any[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  limit?: number;
}

interface EmployeeResponse {
  employee: any;
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

  getAll(params?: EmployeeQueryParams): Observable<{ employees: any[]; total?: number; page?: number; limit?: number }> {
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

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        // Handle response structure: { success, statusCode, message, data: { employees, pagination } }
        const data = response.data || response;
        let employees: any[] = [];
        
        // Extract employees array
        if (data?.employees && Array.isArray(data.employees)) {
          employees = data.employees;
        } else if (Array.isArray(data)) {
          employees = data;
        }
        
        console.log('Employees fetched:', employees.length, employees);
        
        // Format joiningDate to YYYY-MM-DD format
        const formattedEmployees = employees.map(emp => ({
          ...emp,
          joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : emp.joiningDate
        }));
        
        // Extract pagination info - check pagination object first, then direct properties
        const pagination = data?.pagination;
        const total = pagination?.total || data?.total || employees.length;
        const page = pagination?.page || data?.page || params?.page || 1;
        const limit = pagination?.limit || data?.limit || params?.limit || 10;
        
        const result = {
          employees: formattedEmployees,
          total: total,
          page: page,
          limit: limit,
        };
        
        console.log('Formatted result:', result);
        return result;
      }),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<ApiResponse<EmployeeResponse | any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as any;
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

  create(payload: Omit<any, 'id'>): Observable<any> {
      return this.http.post<ApiResponse<EmployeeResponse | any>>(this.apiUrl, payload).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as any;
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

    update(id: number, payload: Partial<any>): Observable<any> {
    return this.http.put<ApiResponse<EmployeeResponse | any>>(`${this.apiUrl}/${id}`, payload).pipe(
      map(response => {
        const employee = (response.data as any)?.employee || response.data as any;
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
