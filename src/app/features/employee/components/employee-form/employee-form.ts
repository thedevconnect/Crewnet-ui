import { Component, ChangeDetectionStrategy, input, output, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule, DatePickerModule],
  templateUrl: './employee-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeForm {
  readonly initial = input<any>();
  readonly submitForm = output<any>();
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    department: ['', [Validators.required]],
    status: ['Active', [Validators.required]],
    joiningDate: ['', [Validators.required]],
  });

  readonly departments = [
    { label: 'HR', value: 'HR' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' }
  ];

  readonly statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  constructor() {
    effect(() => {
      const v = this.initial();
      if (v) {
        // Convert date string to Date object for calendar
        const dateValue = v.joiningDate ? new Date(v.joiningDate) : null;
        this.form.patchValue({ ...v, joiningDate: dateValue });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Convert date to ISO string format
    const formValue: any = { ...this.form.value };
    if (formValue.joiningDate && formValue.joiningDate instanceof Date) {
      formValue.joiningDate = formValue.joiningDate.toISOString().split('T')[0];
    }
    this.submitForm.emit(formValue);
  }
}
