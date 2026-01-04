import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly currentUser = signal<User | null>(null);
    private readonly baseUrl = 'http://localhost:3000/api';

    getCurrentUser() {
        return this.currentUser.asReadonly();
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('oblo_token');
    }

    getToken(): string | null {
        return localStorage.getItem('oblo_token');
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
            .pipe(
                tap((response) => {
                    if (response.success && response.token && response.user) {
                        // Store token in localStorage
                        localStorage.setItem('oblo_token', response.token);
                        // Store user info in localStorage
                        localStorage.setItem('oblo_user', JSON.stringify(response.user));
                        // Update signal
                        this.currentUser.set(response.user);
                    }
                }),
                catchError((error) => {
                    console.error('Login error:', error);
                    return throwError(() => ({
                        success: false,
                        message: error.error?.message || error.message || 'Login failed. Please try again.',
                    }));
                })
            );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<any>(`${this.baseUrl}/auth/register`, data).pipe(
            map((response) => {
                // Backend returns: { success, message, user: { id, name, email } }
                if (response.success && response.user) {
                    // Convert backend user format to frontend User format
                    const user: User = {
                        id: response.user.id.toString(),
                        name: response.user.name,
                        email: response.user.email,
                    };
                    this.currentUser.set(user);
                    // Return success response (token will be handled by login if needed)
                    return {
                        success: true,
                        message: response.message || 'Registration successful',
                        user: user,
                    };
                }
                throw new Error(response.message || 'Registration failed');
            }),
            catchError((error) => {
                console.error('Registration error:', error);
                return throwError(() => ({
                    success: false,
                    message: error.error?.message || error.message || 'Registration failed. Please try again.',
                }));
            })
        );
    }

    getProfile(id: string): Observable<User> {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/auth/profile/${id}`).pipe(
            map((response) => {
                if (response.success && response.data) {
                    this.currentUser.set(response.data);
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch profile');
            }),
            catchError((error) => {
                console.error('Profile fetch error:', error);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('oblo_token');
        localStorage.removeItem('oblo_user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    loadUser(): void {
        const token = this.getToken();
        if (token) {
            // Try to load user from localStorage first
            const userStr = localStorage.getItem('oblo_user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr) as User;
                    this.currentUser.set(user);
                    return;
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                    localStorage.removeItem('oblo_user');
                }
            }
            // If user not in localStorage, fetch from API if we have user ID
            // This can be extracted from token if JWT, or stored separately
            // For now, we'll leave it as is
        }
    }

    getUsers(params?: { page?: number; limit?: number; search?: string }): Observable<ApiResponse<{ users: User[]; total: number; page: number; limit: number }>> {
        let url = `${this.baseUrl}/auth/users?`;
        if (params?.page) url += `page=${params.page}&`;
        if (params?.limit) url += `limit=${params.limit}&`;
        if (params?.search) url += `search=${params.search}&`;

        return this.http.get<ApiResponse<{ users: User[]; total: number; page: number; limit: number }>>(url).pipe(
            catchError((error) => {
                console.error('Get users error:', error);
                return throwError(() => ({
                    success: false,
                    message: error.error?.message || error.message || 'Failed to fetch users.',
                    data: { users: [], total: 0, page: 1, limit: 100 }
                }));
            })
        );
    }
}
