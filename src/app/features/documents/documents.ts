import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-documents',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Documents</h1>
      <p class="text-gray-600">Documents management page coming soon...</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Documents {}

