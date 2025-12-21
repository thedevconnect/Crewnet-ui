import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../features/employee/models/employee.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-ess-employee',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DrawerModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    Popover,
    BreadcrumbModule,
    SelectModule,
  ],
  templateUrl: './ess-employee.html',
  styleUrl: './ess-employee.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class EssEmployee implements OnInit {
  private readonly svc = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmationService);
  private readonly toast = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly search = signal<string>('');
  protected readonly selectedEmployee = signal<Employee | null>(null);
  protected readonly viewDialog = signal<boolean>(false);
  protected readonly drawerVisible = signal<boolean>(false);
  protected readonly drawerMode = signal<'add' | 'edit' | 'view'>('add');
  protected readonly employeeToEdit = signal<Employee | null>(null);
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(10);
  protected readonly totalRecords = signal<number>(0);
  protected readonly sortBy = signal<string>('');
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');
  protected readonly formLoading = signal<boolean>(false);

  protected readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/dashboard' },
    { label: 'Employees' }
  ]);

  protected readonly departments = [
    { label: 'HR', value: 'HR' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' }
  ];

  protected readonly statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  protected employeeForm: FormGroup;

  // Filtering is now done on the server side via API
  // This computed is kept for any client-side filtering if needed
  readonly filtered = computed(() => {
    return this.employees();
  });

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      joiningDate: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.load();
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
        console.log('Response received in component:', response);
        console.log('Employees array:', response.employees);
        console.log('Total records:', response.total);

        if (response.employees && Array.isArray(response.employees)) {
          this.employees.set(response.employees);
          this.totalRecords.set(response.total || response.employees.length);
          console.log('Employees set:', this.employees().length);
        } else {
          console.warn('No employees array in response:', response);
          this.employees.set([]);
          this.totalRecords.set(0);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || error.message || 'Failed to load employees. Please try again.',
        });
        this.loading.set(false);
        this.employees.set([]);
        this.totalRecords.set(0);
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
    this.drawerMode.set('add');
    this.employeeToEdit.set(null);
    this.employeeForm.reset();
    this.employeeForm.enable(); // Ensure form is enabled for add mode
    this.employeeForm.patchValue({ status: 'Active' });
    this.drawerVisible.set(true);
  }

  onEdit(e: Employee) {
    this.drawerMode.set('edit');
    this.employeeToEdit.set(e);
    this.employeeForm.enable(); // Ensure form is enabled for edit mode
    this.employeeForm.patchValue({
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      status: e.status,
      joiningDate: e.joiningDate
    });
    this.drawerVisible.set(true);
  }

  onView(e: Employee) {
    this.drawerMode.set('view');
    this.employeeToEdit.set(e);
    this.employeeForm.disable(); // Disable all form controls in view mode
    this.employeeForm.patchValue({
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      status: e.status,
      joiningDate: e.joiningDate
    });
    this.drawerVisible.set(true);
  }

  onDrawerClose() {
    this.drawerVisible.set(false);
    this.employeeToEdit.set(null);
    this.employeeForm.reset();
    this.employeeForm.enable(); // Re-enable form when closing
  }

  onFormSubmit() {
    if (this.drawerMode() === 'view') {
      return;
    }

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.formLoading.set(true);
    const formData = { ...this.employeeForm.value };

    if (this.drawerMode() === 'add') {
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
            detail: error.error?.message || 'Failed to create employee. Please try again.',
          });
          this.formLoading.set(false);
        },
      });
    } else if (this.drawerMode() === 'edit') {
      const employee = this.employeeToEdit();
      if (employee) {
        this.svc.update(employee.id, formData).subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully',
            });
            this.drawerVisible.set(false);
            this.employeeForm.reset();
            this.formLoading.set(false);
            this.load();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to update employee. Please try again.',
            });
            this.formLoading.set(false);
          },
        });
      }
    }
  }

  onDelete(e: Employee) {
    this.confirm.confirm({
      message: `Delete ${e.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svc.delete(e.id).subscribe({
          next: (response) => {
            this.toast.add({
              severity: 'success',
              summary: 'Deleted',
              detail: response.message || `${e.name} removed`,
            });
            this.load();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to delete employee. Please try again.',
            });
          },
        });
      },
    });
  }
}

