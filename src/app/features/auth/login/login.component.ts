import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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
    this.error.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.error.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);

    const { email, password } = this.loginForm.value;

    // Simulate API call delay
    setTimeout(() => {
      const success = this.authService.login(email, password);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid email or password');
      }

      this.loading.set(false);
    }, 500);
  }
}
