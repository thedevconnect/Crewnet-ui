import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-leaves',
  imports: [
    SelectModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    TextareaModule,
    PanelModule,
    FileUploadModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    DatePickerModule,
  ],
  templateUrl: './leaves.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaves {
  leaveDrawerVisible = signal(false);
  isSubmitting = signal(false);
  header = signal('Add New Leave');
  headerIcon = signal('pi pi-calendar-plus');
  selectedFile = signal<File | null>(null);

  leaveTypes = [
    { label: 'Casual Leave', value: 'CL' },
    { label: 'Sick Leave', value: 'SL' },
    { label: 'Paid Leave', value: 'PL' },
  ];

  statuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  leaveForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      leaveType: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      attachment: [''],
      status: ['', [Validators.required]],
    });
  }

  openLeaveDrawer() {
    this.leaveDrawerVisible.set(true);
  }

  closeLeaveDrawer() {
    this.leaveDrawerVisible.set(false);
    this.resetLeaveForm();
  }

  resetLeaveForm() {
    this.leaveForm.reset();
    this.selectedFile.set(null);
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.selectedFile.set(file);
      this.leaveForm.patchValue({ attachment: file.name });
    }
  }

  onFileRemove() {
    this.selectedFile.set(null);
    this.leaveForm.patchValue({ attachment: '' });
  }

  onSubmitLeaveForm() {
    if (this.leaveForm.invalid) {
      Object.keys(this.leaveForm.controls).forEach(key => {
        this.leaveForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    console.log(this.leaveForm.value);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.closeLeaveDrawer();
    }, 1000);
  }
}
