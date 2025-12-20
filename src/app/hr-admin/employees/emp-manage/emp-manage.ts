import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-emp-manage',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DrawerModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    ToastModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './emp-manage.html',
  styleUrl: './emp-manage.css',
})
export class EmpManage implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  // API URLs
  private readonly baseURL = 'http://localhost:3000/api';
  private readonly createEmployeeURL = `${this.baseURL}/employees-onboarding`;
  private readonly getEmployeesURL = `${this.baseURL}/employees`;

  // Employee list state
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Table columns configuration - Dynamic columns
  columns: Column[] = [
    { field: 'employeeCode', header: 'Employee Code', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'mobileNumber', header: 'Mobile Number', sortable: false },
    { field: 'department', header: 'Department', sortable: true },
    { field: 'designation', header: 'Designation', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'actions', header: 'Actions', sortable: false, width: '120px' },
  ];

  // Drawer state
  visible = signal<boolean>(false);
  postType = signal<'add' | 'update' | 'view'>('add');
  header = signal<string>('Add Employee');
  headerIcon = signal<string>('pi pi-user-plus');

  // Section toggles
  showEmployeeIdentity = signal<boolean>(true);
  showPersonalDetails = signal<boolean>(true);
  showContactDetails = signal<boolean>(true);
  showJobDetails = signal<boolean>(true);
  showSystemAccess = signal<boolean>(true);

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'HR Admin' },
    { label: 'Employee Management' },
  ];

  // Dropdown options
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  employmentTypeOptions = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Intern', value: 'Intern' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Temporary', value: 'Temporary' },
    { label: 'Seasonal', value: 'Seasonal' },
    { label: 'Project Based', value: 'Project Based' },
    { label: 'Other', value: 'Other' },
  ];

  roleOptions = [
    { label: 'HRADMIN', value: 'HRADMIN' },
    { label: 'ESS', value: 'ESS' },
  ];

  departmentOptions = [
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' },
  ];

  designationOptions = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Senior Manager', value: 'Senior Manager' },
    { label: 'Executive', value: 'Executive' },
    { label: 'Senior Executive', value: 'Senior Executive' },
    { label: 'Associate', value: 'Associate' },
    { label: 'Intern', value: 'Intern' },
  ];

  // Form group
  employeeForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      // Employee Identity
      employeeCode: [''],
      status: ['Active'],

      // Personal Details
      firstName: [''],
      lastName: [''],
      gender: [''],
      dateOfBirth: [''],

      // Contact Details
      email: [''],
      mobileNumber: [''],

      // Job Details
      department: [''],
      designation: [''],
      employmentType: [''],
      joiningDate: [''],

      // System Access
      role: [''],
      username: [],
      firstLogin: [true],
    });
  }

  ngOnInit() {
    this.initForm();
    this.generateEmployeeCode();
    this.loadEmployees();
  }

  // Load employees list
  loadEmployees() {
    this.isLoading.set(true);
    this.http
      .get<any>(this.getEmployeesURL)
      .pipe(
        catchError((error) => {
          console.error('Error loading employees:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to load employees. Please try again.',
          });
          this.isLoading.set(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          // Handle different response formats
          if (response.data && Array.isArray(response.data.employees)) {
            this.employees.set(response.data.employees);
          } else if (Array.isArray(response.data)) {
            this.employees.set(response.data);
          } else if (Array.isArray(response)) {
            this.employees.set(response);
          } else {
            this.employees.set([]);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  // Toggle section visibility
  toggle(section: string) {
    switch (section) {
      case 'showEmployeeIdentity':
        this.showEmployeeIdentity.set(!this.showEmployeeIdentity());
        break;
      case 'showPersonalDetails':
        this.showPersonalDetails.set(!this.showPersonalDetails());
        break;
      case 'showContactDetails':
        this.showContactDetails.set(!this.showContactDetails());
        break;
      case 'showJobDetails':
        this.showJobDetails.set(!this.showJobDetails());
        break;
      case 'showSystemAccess':
        this.showSystemAccess.set(!this.showSystemAccess());
        break;
    }
  }

  // Generate employee code (auto-generated)
  generateEmployeeCode() {
    // Generate a unique employee code (you can modify this logic as per your requirements)
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const employeeCode = `EMP${timestamp}${random}`;
    this.employeeForm.patchValue({ employeeCode });
  }

  // Derive username from email
  onEmailBlur() {
    const email = this.employeeForm.get('email')?.value;
    if (email) {
      const username = email.split('@')[0];
      this.employeeForm.patchValue({ username });
    }
  }

  // Show dialog/drawer
  showDialog(type: 'add' | 'update' | 'view', item?: any) {
    this.postType.set(type);

    if (type === 'add') {
      this.header.set('Add Employee');
      this.headerIcon.set('pi pi-user-plus');
      this.resetAllForms();
      this.generateEmployeeCode();
    } else if (type === 'update') {
      this.header.set('Update Employee');
      this.headerIcon.set('pi pi-user-edit');
      if (item) {
        this.populateForm(item);
      }
    } else if (type === 'view') {
      this.header.set('View Employee');
      this.headerIcon.set('pi pi-eye');
      if (item) {
        this.populateForm(item);
        this.employeeForm.disable();
      }
    }

    this.visible.set(true);
  }

  populateForm(data: any) {
    this.employeeForm.patchValue({
      employeeCode: data.employeeCode || '',
      status: data.status || 'Active',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      gender: data.gender || '',
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : '',
      email: data.email || '',
      mobileNumber: data.mobileNumber || '',
      department: data.department || '',
      designation: data.designation || '',
      employmentType: data.employmentType || '',
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : '',
      role: data.role || '',
      username: data.username || '',
      firstLogin: data.firstLogin !== undefined ? data.firstLogin : true,
    });
  }

  // Form validation helper
  isInvalid(controlName: string, formGroup: FormGroup = this.employeeForm): boolean {
    const control = formGroup.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Reset all forms
  resetAllForms() {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      status: 'Active',
      firstLogin: true,
    });
    this.generateEmployeeCode();
    this.employeeForm.enable();
    this.employeeForm.get('employeeCode')?.disable();
    this.employeeForm.get('username')?.disable();
  }

  // Close drawer
  closeDrawer() {
    this.visible.set(false);
    this.employeeForm.enable();
    this.employeeForm.get('employeeCode')?.disable();
    this.employeeForm.get('username')?.disable();
  }

  // On drawer hide
  onDrawerHide() {
    this.closeDrawer();
  }

  // Submit form
  OnSubmitModal() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly.',
      });
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    // Convert dates to ISO string format (YYYY-MM-DD)
    if (formValue.dateOfBirth instanceof Date) {
      formValue.dateOfBirth = formValue.dateOfBirth.toISOString().split('T')[0];
    }
    if (formValue.joiningDate instanceof Date) {
      formValue.joiningDate = formValue.joiningDate.toISOString().split('T')[0];
    }

    // Remove employeeCode and username from payload (auto-generated by backend)
    const payload = {
      status: formValue.status,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth,
      email: formValue.email,
      mobileNumber: formValue.mobileNumber,
      department: formValue.department,
      designation: formValue.designation,
      employmentType: formValue.employmentType,
      joiningDate: formValue.joiningDate,
      role: formValue.role,
      firstLogin: formValue.firstLogin,
    };

    if (this.postType() === 'add') {
      this.createEmployee(payload);
    } else if (this.postType() === 'update') {
      // TODO: Implement update API call when endpoint is available
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Update functionality will be implemented soon.',
      });
    }
  }

  // Create employee
  createEmployee(payload: any) {
    this.isSubmitting.set(true);
    this.http
      .post<any>(this.createEmployeeURL, payload)
      .pipe(
        catchError((error) => {
          console.error('Error creating employee:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create employee. Please try again.',
          });
          this.isSubmitting.set(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Employee created successfully!',
          });
          this.closeDrawer();
          this.loadEmployees(); // Reload employee list
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  // Get cell value dynamically based on column field
  getCellValue(emp: any, field: string): string {
    switch (field) {
      case 'employeeCode':
        return emp.employeeCode || emp.employee_code || '-';
      case 'name':
        const firstName = emp.firstName || emp.first_name || '';
        const lastName = emp.lastName || emp.last_name || '';
        return `${firstName} ${lastName}`.trim() || '-';
      case 'email':
        return emp.email || '-';
      case 'mobileNumber':
        return emp.mobileNumber || emp.mobile_number || '-';
      case 'department':
        return emp.department || '-';
      case 'designation':
        return emp.designation || '-';
      case 'status':
        return emp.status || 'Active';
      default:
        return emp[field] || '-';
    }
  }
}
