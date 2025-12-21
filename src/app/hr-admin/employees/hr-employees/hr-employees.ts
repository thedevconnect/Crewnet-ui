import { Component, OnInit, signal, inject } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';

import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-HrEmployees',
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
    DatePickerModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './hr-employees.html',
  styleUrls: ['./hr-employees.css']
})
export class HrEmployees implements OnInit {

  private employeeService = inject(EmployeeService);
  private confirmationService = inject(ConfirmationService);

  visible = signal(false);
  viewDialogVisible = signal(false);
  isSubmitting = signal(false);
  loading = signal(false);
  employees = signal<any[]>([]);
  selectedEmployee = signal<any>(null);
  drawerMode = signal<'add' | 'edit'>('add');

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
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.employeeService.getAll().subscribe({
      next: (response) => {
        if (response.employees && Array.isArray(response.employees)) {
          this.employees.set(response.employees);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employees loaded successfully'
          });
        } else {
          this.employees.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load employees'
        });
        this.loading.set(false);
        this.employees.set([]);
      }
    });
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
    this.drawerMode.set('add');
    this.header.set(' Add New Employee');
    this.headerIcon.set('pi pi-user-plus');
    this.visible.set(true);
    this.resetAllForms();
    this.generateEmployeeCode();
  }

  viewEmployee(employee: any): void {
    this.selectedEmployee.set(employee);
    this.viewDialogVisible.set(true);
  }

  editEmployee(employee: any): void {
    this.drawerMode.set('edit');
    this.header.set(' Edit Employee');
    this.headerIcon.set('pi pi-pencil');
    this.selectedEmployee.set(employee);
    this.populateForm(employee);
    this.visible.set(true);
  }

  deleteEmployee(employee: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.employeeService.delete(employee.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message || 'Employee deleted successfully'
            });
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to delete employee'
            });
          }
        });
      }
    });
  }

  private populateForm(employee: any): void {
    const dateOfBirth = employee.date_of_birth ? new Date(employee.date_of_birth) : null;
    const joiningDate = employee.joining_date ? new Date(employee.joining_date) : new Date();
    
    this.employeeForm.patchValue({
      employeeCode: employee.employee_code || '',
      status: employee.status === 'ACTIVE' ? 'Active' : 'Inactive',
      firstName: employee.first_name || '',
      lastName: employee.last_name || '',
      gender: employee.gender || null,
      dateOfBirth: dateOfBirth,
      email: employee.email || '',
      mobileNumber: employee.mobile_number || '',
      department: employee.department || null,
      designation: employee.designation || null,
      employmentType: employee.employment_type || null,
      joiningDate: joiningDate,
      role: employee.role || null,
      username: employee.username || '',
      firstLogin: employee.first_login === 1 || employee.first_login === true
    });
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
    // Disable employee code field after reset (for add mode)
    this.employeeForm.get('employeeCode')?.disable();
    this.isSubmitting.set(false);
    this.selectedEmployee.set(null);
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
    const formValue = this.employeeForm.getRawValue();
    
    // Transform form data to API format
    const payload = {
      employee_code: formValue.employeeCode,
      status: formValue.status.toUpperCase(),
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      gender: formValue.gender,
      date_of_birth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : null,
      email: formValue.email,
      mobile_number: formValue.mobileNumber,
      department: formValue.department,
      designation: formValue.designation,
      employment_type: formValue.employmentType,
      joining_date: formValue.joiningDate ? new Date(formValue.joiningDate).toISOString() : null,
      role: formValue.role,
      username: formValue.username,
      first_login: formValue.firstLogin ? 1 : 0
    };

    if (this.drawerMode() === 'add') {
      // Create new employee
      this.employeeService.create(payload).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.visible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee added successfully!'
          });
          this.resetAllForms();
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to add employee'
          });
        }
      });
    } else {
      // Update existing employee
      const employeeId = this.selectedEmployee()?.id;
      if (employeeId) {
        this.employeeService.update(employeeId, payload).subscribe({
          next: (response) => {
            this.isSubmitting.set(false);
            this.visible.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully!'
            });
            this.resetAllForms();
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to update employee'
            });
          }
        });
      }
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  formatDateTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-GB', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
