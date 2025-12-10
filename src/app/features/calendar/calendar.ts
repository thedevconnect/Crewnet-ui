import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-calendar',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Calendar</h1>
      <p class="text-gray-600">Calendar page coming soon...</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {}

