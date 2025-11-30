import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Settings</h1>
          <p>Configure application settings</p>
        </div>
      </div>
      <div class="card">
        <p class="placeholder-text">Settings module coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.875rem; font-weight: 700; color: #111827; margin: 0 0 0.25rem 0; }
    .page-header p { color: #6b7280; margin: 0; }
    .card { background: white; border-radius: 0.75rem; padding: 3rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); text-align: center; }
    .placeholder-text { color: #6b7280; font-size: 1rem; margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
