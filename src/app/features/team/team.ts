import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-team',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Team</h1>
      <p class="text-gray-600">Team management page coming soon...</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team {}

