import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-expenses',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Expenses</h1>
      <p class="text-gray-600">Expense management coming soon...</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expenses {}

