import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-captcha',
  imports: [CommonModule],
  templateUrl: './captcha.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaComponent {
  // Placeholder captcha component
  // TODO: Implement actual captcha functionality (Google reCAPTCHA, hCaptcha, etc.)
}
