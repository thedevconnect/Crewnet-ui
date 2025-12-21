import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { MessageService, MenuItem } from 'primeng/api';

// PrimeNG Modules
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-emp-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    BreadcrumbModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    CheckboxModule,
    PanelModule,
    SelectModule,
    DatePickerModule
  ],
  providers: [MessageService],
  templateUrl: './emp-manage.html',
  styleUrls: ['./emp-manage.css']
})
export class EmpManage implements OnInit {


  visible = signal(false);
  isSubmitting = signal(false);

  header = signal(' Add New Employee');
  headerIcon = signal('pi pi-user-plus');


  showEmployeeIdentity = signal(true);
  showPersonalDetails = signal(true);
  showContactDetails = signal(true);
  showJobDetails = signal(true);
  showSystemAccess = signal(true);

  employeeForm!: FormGroup;
  breadcrumbItems!: MenuItem[];

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  departmentOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'HR', value: 'HR' },
    { label: 'Sales', value: 'Sales' }
  ];

  designationOptions = [
    { label: 'Developer', value: 'Developer' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Analyst', value: 'Analyst' }
  ];

  employmentTypeOptions = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Intern', value: 'Intern' }
  ];

  roleOptions = [
    { label: 'ESS', value: 'ESS' },
    { label: 'HR Admin', value: 'HR Admin' },
    { label: 'HR Manager', value: 'HR Manager' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', icon: 'pi pi-home' },
      { label: 'Employees', icon: 'pi pi-users' }
    ];

    this.initForm();
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      employeeCode: [{ value: '', disabled: true }, Validators.required],
      status: ['Active', Validators.required],

      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],

      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]
      ],

      department: [null, Validators.required],
      designation: [null, Validators.required],
      employmentType: [null, Validators.required],
      joiningDate: [new Date(), Validators.required],

      role: [null, Validators.required],
      username: [{ value: '', disabled: true }],
      firstLogin: [true]
    });

    this.employeeForm.get('email')?.valueChanges.subscribe(email => {
      if (email && email.includes('@')) {
        this.employeeForm.patchValue(
          { username: email.split('@')[0] },
          { emitEvent: false }
        );
      }
    });
  }


  showDialog(): void {
    this.visible.set(true);
    this.generateEmployeeCode();
  }

  closeDrawer(): void {
    this.visible.set(false);
  }

  onDrawerHide(): void {
    this.resetAllForms();
  }

  toggle(section: string): void {
    switch (section) {
      case 'showEmployeeIdentity':
        this.showEmployeeIdentity.update(v => !v);
        break;
      case 'showPersonalDetails':
        this.showPersonalDetails.update(v => !v);
        break;
      case 'showContactDetails':
        this.showContactDetails.update(v => !v);
        break;
      case 'showJobDetails':
        this.showJobDetails.update(v => !v);
        break;
      case 'showSystemAccess':
        this.showSystemAccess.update(v => !v);
        break;
    }
  }

  private generateEmployeeCode(): void {
    const code = 'EMP-' + Math.floor(1000 + Math.random() * 9000);
    this.employeeForm.patchValue({ employeeCode: code });
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  resetAllForms(): void {
    this.employeeForm.reset({
      status: 'Active',
      joiningDate: new Date(),
      firstLogin: true
    });
    this.isSubmitting.set(false);
  }

  OnSubmitModal(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly.'
      });
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.employeeForm.getRawValue();

    console.log('Submitting Employee:', payload);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.visible.set(false);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee added successfully!'
      });

      this.resetAllForms();
    }, 1000);
  }
}
