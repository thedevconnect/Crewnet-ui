import { Component, OnInit, signal, inject, computed } from '@angular/core';
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
import { MenuModule } from 'primeng/menu';
import { ConfirmationService } from 'primeng/api';
import { BreadcrumbModule as PrimeNgBreadcrumbModule } from 'primeng/breadcrumb';
import { TemplateRef, ViewChild } from '@angular/core';
import { TableTemplate, TableColumn } from '../../../table-template/table-template';

import { EmployeeService } from '../../../core/services/employee.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-HrEmployees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    PrimeNgBreadcrumbModule,
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
    TooltipModule,
    MenuModule,
    PrimeNgBreadcrumbModule,
    TableTemplate,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './hr-employees.html',
  styleUrls: ['./hr-employees.scss']
})
export class HrEmployees implements OnInit {
  protected readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Employees' }
  ]);

  private employeeService = inject(EmployeeService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild('actionTemplateRef') actionTemplateRef!: TemplateRef<any>;
  @ViewChild('statusTemplateRef') statusTemplateRef!: TemplateRef<any>;
  @ViewChild(TableTemplate) tableTemplate!: TableTemplate;
  
  refreshTable = signal(0);

  visible = signal(false);
  viewDialogVisible = signal(false);
  isSubmitting = signal(false);
  selectedEmployee = signal<any>(null);
  drawerMode = signal<'add' | 'edit'>('add');
  
  // Table properties
  columns: TableColumn[] = [
    { key: 'actions', header: 'Actions', isVisible: true, isCustom: true },
    { key: 'employeeCode', header: 'Employee Code', isVisible: true, isSortable: true },
    { key: 'name', header: 'Name', isVisible: true, isSortable: true },
    { key: 'email', header: 'Email', isVisible: true, isSortable: true },
    { key: 'mobileNumber', header: 'Mobile', isVisible: true },
    { key: 'department', header: 'Department', isVisible: true },
    { key: 'designation', header: 'Designation', isVisible: true },
    { key: 'employmentType', header: 'Type', isVisible: true },
    { key: 'role', header: 'Role', isVisible: true },
    { key: 'jsonDetails', header: 'Status', isVisible: true, isCustom: true },
    { key: 'joiningDate', header: 'Joining', isVisible: true, isSortable: true },
  ];

  header = signal(' Add New Employee11');
  headerIcon = signal('pi pi-user-plus');


  showEmployeeIdentity = signal(true);
  showPersonalDetails = signal(true);
  showContactDetails = signal(true);
  showJobDetails = signal(true);
  showSystemAccess = signal(true);

  employeeForm!: FormGroup;

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
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Intern', value: 'Intern' },
    { label: 'Temporary', value: 'Temporary' }
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
    this.initForm();
  }

  // Data fetch function for table-template
  fetchEmployeesData = async (params: any) => {
    return this.employeeService.getAll({
      page: params.page,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }).pipe(
      map((response) => {
        if (response.employees && Array.isArray(response.employees)) {
          // Transform data for table
          const transformedEmployees = response.employees.map((emp: any) => ({
            ...emp,
            name: `${emp.firstName || emp.first_name || ''} ${emp.lastName || emp.last_name || ''}`.trim(),
            mobileNumber: emp.mobileNumber || emp.mobile_number || '',
            employeeCode: emp.employeeCode || emp.employee_code || '',
            joiningDate: this.formatDate(emp.joiningDate || emp.joining_date || ''),
            employmentType: emp.employmentType || emp.employment_type || '',
          }));
          return {
            data: transformedEmployees,
            total: response.total || transformedEmployees.length
          };
        }
        return { data: [], total: 0 };
      }),
      catchError((error) => {
        console.error('Error loading employees:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load employees'
        });
        return of({ data: [], total: 0 });
      })
    );
  };

  private initForm(): void {
    this.employeeForm = this.fb.group({
      employeeCode: [{ value: '', disabled: true }, Validators.required],
      status: ['Active', Validators.required],

      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      gender: ['Male', Validators.required],
      dateOfBirth: [null, Validators.required],

      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],

      department: [null, Validators.required],
      designation: [null, Validators.required],
      employmentType: ['Full-time', Validators.required],
      joiningDate: [new Date(), Validators.required],

      role: ['ESS', Validators.required],
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

  getActionMenuItems(employee: any): MenuItem[] {
    return [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => {
          this.viewEmployee(employee);
        }
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.editEmployee(employee);
        }
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600',
        command: () => {
          this.deleteEmployee(employee);
        }
      }
    ];
  }

  deleteEmployee(employee: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.firstName || employee.first_name} ${employee.lastName || employee.last_name}?`,
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
            this.refreshTableData();
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
    // Support both camelCase (from API) and snake_case (legacy)
    const dateOfBirth = employee.dateOfBirth || employee.date_of_birth ? new Date(employee.dateOfBirth || employee.date_of_birth) : null;
    const joiningDate = employee.joiningDate || employee.joining_date ? new Date(employee.joiningDate || employee.joining_date) : new Date();

    this.employeeForm.patchValue({
      employeeCode: employee.employeeCode || employee.employee_code || '',
      status: (employee.status === 'ACTIVE' || employee.status === 'Active') ? 'Active' : 'Inactive',
      firstName: employee.firstName || employee.first_name || '',
      lastName: employee.lastName || employee.last_name || '',
      gender: employee.gender || null,
      dateOfBirth: dateOfBirth,
      email: employee.email || '',
      mobileNumber: employee.mobileNumber || employee.mobile_number || '',
      department: employee.department || null,
      designation: employee.designation || null,
      employmentType: employee.employmentType || employee.employment_type || null,
      joiningDate: joiningDate,
      role: employee.role || null,
      username: employee.username || '',
      firstLogin: employee.firstLogin === true || employee.firstLogin === 1 || employee.first_login === 1 || employee.first_login === true
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
      gender: 'Male',
      role: 'ESS',
      employmentType: 'Full Time',
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

    const formValue = this.employeeForm.getRawValue();
    const isAddMode = this.drawerMode() === 'add';
    const selectedEmp = this.selectedEmployee();
    const employeeName = isAddMode
      ? `${formValue.firstName} ${formValue.lastName}`
      : `${selectedEmp?.firstName || selectedEmp?.first_name} ${selectedEmp?.lastName || selectedEmp?.last_name}`;

    // Show confirmation dialog
    this.confirmationService.confirm({
      message: isAddMode
        ? `Are you sure you want to add employee "${employeeName}"?`
        : `Are you sure you want to update employee "${employeeName}"?`,
      header: isAddMode ? 'Confirm Add Employee' : 'Confirm Update Employee',
      icon: isAddMode ? 'pi pi-user-plus' : 'pi pi-pencil',
      acceptButtonStyleClass: 'p-button-primary',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.submitEmployee(formValue);
      },
      reject: () => {
        // User cancelled - show info toast
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: isAddMode ? 'Employee addition cancelled.' : 'Employee update cancelled.'
        });
      }
    });
  }

  private submitEmployee(formValue: any): void {
    this.isSubmitting.set(true);

    // Helper function to format date to YYYY-MM-DD
    const formatDateOnly = (date: any): string | null => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Transform form data to API format
    const payload = {
      employee_code: formValue.employeeCode,
      status: formValue.status.toUpperCase(),
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      gender: formValue.gender,
      date_of_birth: formatDateOnly(formValue.dateOfBirth),
      email: formValue.email,
      mobile_number: formValue.mobileNumber,
      department: formValue.department,
      designation: formValue.designation,
      employment_type: formValue.employmentType,
      joining_date: formatDateOnly(formValue.joiningDate),
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
            detail: `Employee "${formValue.firstName} ${formValue.lastName}" added successfully!`,
            life: 3000
          });
          this.resetAllForms();
          this.refreshTableData();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to add employee',
            life: 5000
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
              detail: `Employee "${formValue.firstName} ${formValue.lastName}" updated successfully!`,
              life: 3000
            });
            this.resetAllForms();
            this.refreshTableData();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.isSubmitting.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to update employee',
              life: 5000
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

  refreshTableData(): void {
    if (this.tableTemplate) {
      this.tableTemplate.loadData();
    } else {
      // Fallback: trigger refresh by updating signal
      this.refreshTable.update(v => v + 1);
    }
  }
}
