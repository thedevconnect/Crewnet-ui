import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-leaves',
  imports: [
    SelectModule, ButtonModule, DrawerModule, InputTextModule,
    TextareaModule, PanelModule, ReactiveFormsModule, ToastModule,
    CommonModule, DatePickerModule,
  ],
  templateUrl: './leaves.html',
  styleUrls: ['./leaves.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaves {
  private fb = inject(FormBuilder);

  leaveDrawerVisible = signal(false);
  isSubmitting = signal(false);
  header = signal('Add New Leave');
  headerIcon = signal('pi pi-calendar-plus');

  leaveTypes = [
    { label: 'Loss of Pay(LoP)', value: 'LoP' },
    { label: 'Outdoor Duty(OD)', value: 'OD' },
    { label: 'Casual Leave-1.00(CL)', value: 'CL' },
    { label: 'Earned Leave-3.61(EL)', value: 'EL' },
    { label: 'Restricted Holiday-2.00(RH)', value: 'RH' },
  ];

  sessionOptions = [
    { label: 'First Half', value: 'First Half' },
    { label: 'Second Half', value: 'Second Half' },
  ];

  leaveForm = this.fb.group({
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
    sessionFrom: ['', [Validators.required]],
    sessionTo: ['', [Validators.required]],
    leaveType: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    ccTo: [''],
  });

  openLeaveDrawer() {
    this.leaveDrawerVisible.set(true);
  }

  closeLeaveDrawer() {
    this.leaveDrawerVisible.set(false);
    this.leaveForm.reset();
  }

  onSubmitLeaveForm() {
    console.log(this.leaveForm.value);
    return;
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
