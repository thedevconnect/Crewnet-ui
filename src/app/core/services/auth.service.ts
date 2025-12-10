import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
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

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly currentUser = signal<User | null>({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@crewnet.com',
        role: 'Administrator'
    });
    private readonly apiUrl = environment.apiUrl;

    getCurrentUser() {
        return this.currentUser.asReadonly();
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('crewnet_token');
    }

    getToken(): string | null {
        return localStorage.getItem('crewnet_token');
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap((response) => {
                    if (response.success && response.token && response.user) {
                        localStorage.setItem('crewnet_token', response.token);
                        this.currentUser.set(response.user);
                    }
                }),
                catchError((error) => {
                    console.error('Login error:', error);
                    return of({
                        success: false,
                        message: error.error?.message || 'Login failed. Please try again.',
                    });
                })
            );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap((response) => {
                if (response.success && response.token && response.user) {
                    localStorage.setItem('crewnet_token', response.token);
                    this.currentUser.set(response.user);
                }
            }),
            catchError((error) => {
                console.error('Registration error:', error);
                return of({
                    success: false,
                    message: error.error?.message || 'Registration failed. Please try again.',
                });
            })
        );
    }

    logout(): void {
        localStorage.removeItem('crewnet_token');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    loadUser(): void {
        const token = this.getToken();
        if (token) {
            // In a real app, you would fetch user data from the API
            // For now, we'll just check if token exists
            // this.http.get<User>(`${this.apiUrl}/me`).subscribe(user => {
            //   this.currentUser.set(user);
            // });
        }
    }
}
