import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly currentUser = signal<User | null>(null);

  // Static mock user for testing
  private readonly MOCK_USER: User = {
    id: '1',
    name: 'Mausam Tyagi',
    email: 'mausam@crewnet.com',
    role: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=Mausam+Tyagi&background=2563eb&color=fff',
  };

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('crewnet_token');
  }

  getToken(): string | null {
    return localStorage.getItem('crewnet_token');
  }

  login(email: string, password: string): boolean {
    // Mock login - accept any email/password for now
    if (email && password) {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('crewnet_token', token);
      this.currentUser.set(this.MOCK_USER);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('crewnet_token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  loadUser(): void {
    const token = this.getToken();
    if (token) {
      this.currentUser.set(this.MOCK_USER);
    }
  }
}
