import { Component, ChangeDetectionStrategy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly loginForm: FormGroup;
  protected readonly error = signal('');
  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          // Token is already stored by the service in tap operator
          // Wait a tick to ensure localStorage is updated
          setTimeout(() => {
            if (this.authService.isAuthenticated()) {
              const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/dashboard';
              this.router.navigate([returnUrl]).then(() => {
                this.loading.set(false);
                this.cdr.detectChanges();
              }).catch(() => {
                // Fallback: use window.location if router navigation fails
                this.loading.set(false);
                window.location.href = '/dashboard';
              });
            } else {
              this.loading.set(false);
              console.error('Token not found after login');
              this.error.set('Authentication failed. Please try again.');
              this.cdr.detectChanges();
            }
          }, 0);
        } else {
          this.loading.set(false);
          this.error.set(response.message || 'Login failed. Please try again.');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.message ||
          err?.error?.message ||
          'Login failed. Please check your credentials.'
        );
        this.cdr.detectChanges();
      },
    });
  }
}
