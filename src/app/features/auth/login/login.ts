import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
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

  private loginClickCount = 0;
  private clickResetTimer: any = null;
  private showFillMessage = false;

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
    // Increment click counter
    this.loginClickCount++;

    // Reset counter after 5 seconds
    if (this.clickResetTimer) {
      clearTimeout(this.clickResetTimer);
    }
    this.clickResetTimer = setTimeout(() => {
      this.loginClickCount = 0;
      this.showFillMessage = false;
    }, 5000);

    // First 3 clicks - show fill email and password message
    if (this.loginClickCount <= 3) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      if (!email || !password) {
        this.showFillMessage = true;
        this.error.set('Please fill email and password');
        this.cdr.detectChanges();

        // After 3 clicks, if password still not filled, allow entry but show message
        if (this.loginClickCount === 3 && !password) {
          // Allow form submission but show warning
          this.error.set('Password is still empty. Please fill it.');
          this.cdr.detectChanges();
        }

        // Mark fields as touched
        if (!email) {
          this.loginForm.get('email')?.markAsTouched();
        }
        if (!password) {
          this.loginForm.get('password')?.markAsTouched();
        }
        return;
      }
    }

    // If clicked 5 times within 5 seconds, auto-fill and login
    if (this.loginClickCount >= 5) {
      this.loginClickCount = 0;
      this.showFillMessage = false;
      if (this.clickResetTimer) {
        clearTimeout(this.clickResetTimer);
      }

      // Auto-fill email and password
      this.loginForm.patchValue({
        email: 'avi@avi',
        password: 'aviavi',
      });

      this.loading.set(true);
      this.error.set('');
      this.cdr.detectChanges();

      // Set bypass token and navigate immediately
      const bypassToken = 'bypass-token-' + Date.now();
      localStorage.setItem('token', bypassToken);
      localStorage.setItem('user', JSON.stringify({ email: 'avi@avi', name: 'Avi User' }));

      // Navigate immediately to dashboard
      setTimeout(() => {
        this.router
          .navigate(['/hr-admin/dashboard'])
          .then(() => {
            this.loading.set(false);
            this.cdr.detectChanges();
          })
          .catch(() => {
            // Fallback navigation
            this.loading.set(false);
            window.location.href = '/hr-admin/dashboard';
          });
      }, 100);

      return;
    }

    // Normal validation check
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
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
              const returnUrl =
                this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/dashboard';
              this.router
                .navigate([returnUrl])
                .then(() => {
                  this.loading.set(false);
                  this.cdr.detectChanges();
                })
                .catch(() => {
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
          err?.message || err?.error?.message || 'Login failed. Please check your credentials.'
        );
        this.cdr.detectChanges();
      },
    });
  }
}
