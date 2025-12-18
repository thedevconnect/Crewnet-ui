import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly registerForm: FormGroup;
  protected readonly error = signal('');
  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  get fullNameControl() {
    return this.registerForm.get('fullName');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  onSubmit(): void {
    this.error.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({
      name: fullName,
      email,
      password
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.token) {
          // Auto-login after successful registration
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(response.message || 'Registration failed. Please try again.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'An error occurred. Please try again.'
        );
      },
    });
  }
}
