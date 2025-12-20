import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DrawerModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    Popover,
    BreadcrumbModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    CheckboxModule,
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class EmployeeList implements OnInit {
  private readonly svc = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmationService);
  private readonly toast = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  protected readonly employees = signal<any[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly search = signal<string>('');
  protected readonly drawerVisible = signal<boolean>(false);
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(10);
  protected readonly totalRecords = signal<number>(0);
  protected readonly sortBy = signal<string>('');
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');
  protected readonly formLoading = signal<boolean>(false);

  // Collapsible sections
  protected showEmployeeIdentity = signal<boolean>(true);
  protected showPersonalDetails = signal<boolean>(true);
  protected showContactDetails = signal<boolean>(true);
  protected showJobDetails = signal<boolean>(true);
  protected showSystemAccess = signal<boolean>(true);

  protected employeeForm: FormGroup = this.fb.group({
    // Employee Identity
    employeeCode: [{ value: '', disabled: true }],
    status: ['Active', [Validators.required]],
    // Personal Details
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    // Contact Details
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, this.mobileNumberValidator]],
    // Job Details
    department: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    employmentType: ['Full Time', [Validators.required]],
    joiningDate: ['', [Validators.required]],
    // System Access
    role: ['ESS', [Validators.required]],
    username: [{ value: '', disabled: true }],
    firstLogin: [true]
  });

  protected readonly departments = [
    { label: 'HR', value: 'HR' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' }
  ];

  protected readonly statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  protected readonly genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  protected readonly employmentTypes = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Intern', value: 'Intern' }
  ];

  protected readonly roles = [
    { label: 'HRADMIN', value: 'HRADMIN' },
    { label: 'ESS', value: 'ESS' }
  ];

  protected readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/dashboard' },
    { label: 'Employees' }
  ]);


  // Form is now handled by EmployeeForm component

  // Filtering is now done on the server side via API
  // This computed is kept for any client-side filtering if needed
  readonly filtered = computed(() => {
    return this.employees();
  });

  ngOnInit() {
    this.load();
    // Auto-fill username from email
    this.employeeForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.employeeForm.patchValue({ username: email }, { emitEvent: false });
      }
    });
    // Auto-generate employeeCode
    this.generateEmployeeCode();
  }

  mobileNumberValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(control.value) ? null : { invalidMobile: true };
  }

  generateEmployeeCode() {
    // Generate a simple employee code
    const code = `EMP${String(Date.now()).slice(-6)}`;
    this.employeeForm.patchValue({ employeeCode: code });
  }

  toggle(section: string) {
    switch (section) {
      case 'employeeIdentity':
        this.showEmployeeIdentity.set(!this.showEmployeeIdentity());
        break;
      case 'personalDetails':
        this.showPersonalDetails.set(!this.showPersonalDetails());
        break;
      case 'contactDetails':
        this.showContactDetails.set(!this.showContactDetails());
        break;
      case 'jobDetails':
        this.showJobDetails.set(!this.showJobDetails());
        break;
      case 'systemAccess':
        this.showSystemAccess.set(!this.showSystemAccess());
        break;
    }
  }

  isInvalid(field: string, formGroup: FormGroup = this.employeeForm): boolean {
    const control = formGroup.get(field);
    return !!(control && control.invalid && control.touched);
  }

  load() {
    this.loading.set(true);
    const params = {
      page: this.currentPage(),
      limit: this.pageSize(),
      search: this.search() || undefined,
      sortBy: this.sortBy() || undefined,
      sortOrder: this.sortOrder() || undefined,
    };

    this.svc.getAll(params).subscribe({
      next: (response) => {
        this.employees.set(response.employees);
        this.totalRecords.set(response.total || response.employees.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load employees. Please try again.',
        });
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    if (event.first !== undefined) {
      this.currentPage.set(Math.floor(event.first / event.rows) + 1);
      this.pageSize.set(event.rows);
    } else {
      this.currentPage.set(event.page + 1); // Fallback for paginator events
      this.pageSize.set(event.rows);
    }

    // Handle sorting from lazy load event
    if (event.sortField) {
      this.sortBy.set(event.sortField);
      this.sortOrder.set(event.sortOrder === 1 ? 'asc' : 'desc');
    }

    this.load();
  }

  onSort(event: any) {
    this.sortBy.set(event.field);
    this.sortOrder.set(event.order === 1 ? 'asc' : 'desc');
    this.currentPage.set(1);
    this.load();
  }

  onSearch() {
    this.currentPage.set(1);
    this.load();
  }

  onAdd() {
    this.employeeForm.reset();
    this.generateEmployeeCode();
    this.employeeForm.patchValue({
      status: 'Active',
      employmentType: 'Full Time',
      role: 'ESS',
      firstLogin: true
    });
    this.drawerVisible.set(true);
  }

  onDrawerClose() {
    this.drawerVisible.set(false);
    this.employeeForm.reset();
  }

  resetAllForms() {
    this.employeeForm.reset();
    this.generateEmployeeCode();
    this.employeeForm.patchValue({
      status: 'Active',
      employmentType: 'Full Time',
      role: 'ESS',
      firstLogin: true
    });
  }

  onFormSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.formLoading.set(true);
    const formValue = this.employeeForm.getRawValue();
    
    // Convert dates to ISO string format
    const formData: any = { ...formValue };
    if (formData.dateOfBirth && formData.dateOfBirth instanceof Date) {
      formData.dateOfBirth = formData.dateOfBirth.toISOString().split('T')[0];
    }
    if (formData.joiningDate && formData.joiningDate instanceof Date) {
      formData.joiningDate = formData.joiningDate.toISOString().split('T')[0];
    }

    this.svc.create(formData).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee added successfully',
        });
        this.drawerVisible.set(false);
        this.employeeForm.reset();
        this.formLoading.set(false);
        this.load();
      },
      error: (error) => {
        console.error('Error creating employee:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create employee. Please try again.',
        });
        this.formLoading.set(false);
      },
    });
  }
}
