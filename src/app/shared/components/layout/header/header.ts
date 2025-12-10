import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

export interface UserDetails {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    InputTextModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly user = input.required<UserDetails>();
  readonly onLogout = output<void>();

  logout(): void {
    this.onLogout.emit();
  }
}

