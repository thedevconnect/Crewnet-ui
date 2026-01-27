import { Component, ChangeDetectionStrategy, signal, inject, ChangeDetectorRef, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CaptchaComponent } from '../../../common components/captcha/captcha';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ToastModule, CaptchaComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);

  // Form data
  userId: string = '';
  password: string = '';
  resetEmail: string = '';
  showPassword: boolean = false;

  // Form display signals
  protected readonly formIcon = signal('pi pi-arrow-right');
  protected readonly formTitle = signal('Welcome back!');
  protected readonly formSubtitle = signal('Please fill the fields to sign-in oblo');

  // State signals
  protected readonly isLoginView = signal(true);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  // Computed values for form display
  protected readonly isLogin = computed(() => this.isLoginView());
  protected readonly isProccess = computed(() => this.loading());

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  toggleView(): void {
    this.isLoginView.update((value) => !value);
    this.error.set('');
    this.userId = '';
    this.password = '';
    this.resetEmail = '';

    // Update form display based on view
    if (this.isLoginView()) {
      this.formIcon.set('pi pi-arrow-right');
      this.formTitle.set('Welcome back!');
      this.formSubtitle.set('Please fill the fields to sign-in oblo');
    } else {
      this.formIcon.set('pi pi-key');
      this.formTitle.set('RESET PASSWORD');
      this.formSubtitle.set('Enter your email to receive a password reset link');
    }

    this.cdr.detectChanges();
  }

  login(): void {
    this.loading.set(true);

    this.authService.login(this.userId, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  resetPassword(): void {
    if (!this.resetEmail) {
      this.error.set('Please enter your email address');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your email address',
      });
      this.cdr.detectChanges();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.resetEmail)) {
      this.error.set('Please enter a valid email address');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid email address',
      });
      this.cdr.detectChanges();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // TODO: Implement password reset service call
    // For now, just show a success message
    setTimeout(() => {
      this.loading.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password reset link has been sent to your email',
      });
      this.resetEmail = '';
      this.cdr.detectChanges();
    }, 1000);
  }
}
